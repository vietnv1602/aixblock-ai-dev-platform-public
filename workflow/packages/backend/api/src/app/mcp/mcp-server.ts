import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { FastifyBaseLogger, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { EngineHelperResponse } from 'server-worker'
import { PropertyType } from 'workflow-blocks-framework'
import { UserInteractionJobType } from 'workflow-server-shared'
import { EngineResponseStatus, ExecuteActionResponse, FlowStatus, FlowVersionState, GetFlowVersionForWorkerRequestType, isNil, McpBlockStatus, McpBlockWithConnection, McpTrigger, TriggerType } from 'workflow-shared'
import { blockMetadataService } from '../blocks/block-metadata-service'
import { flowService } from '../flows/flow/flow.service'
import { projectService } from '../project/project-service'
import { webhookSimulationService } from '../webhooks/webhook-simulation/webhook-simulation-service'
import { webhookService } from '../webhooks/webhook.service'
import { userInteractionWatcher } from '../workers/user-interaction-watcher'
import { mcpService } from './mcp-service'
import { MAX_TOOL_NAME_LENGTH, mcpPropertyToZod, piecePropertyToZod } from './mcp-utils'

export async function createMcpServer({
    mcpId,
    reply,
    logger,
}: CreateMcpServerRequest): Promise<CreateMcpServerResponse> {
    const transport = new SSEServerTransport('/api/v1/mcp/messages', reply.raw)
    const server = new McpServer({
        name: 'Activepieces',
        version: '1.0.0',
    })

    await addPiecesToServer(server, mcpId, logger)
    await addFlowsToServer(server, mcpId, logger)

    return { server, transport }
}

async function addPiecesToServer(
    server: McpServer,
    mcpId: string,
    logger: FastifyBaseLogger,
): Promise<void> {
    const mcp = await mcpService(logger).getOrThrow({ mcpId })
    const projectId = mcp.projectId
    const platformId = await projectService.getPlatformId(projectId)

    // filter out pieces that are not enabled
    const enabledPieces = mcp.pieces.filter((piece) => piece.status === McpBlockStatus.ENABLED)

    // Get all pieces with their connections
    const pieces = await Promise.all(enabledPieces.map(async (piece: McpBlockWithConnection) => {
        return blockMetadataService(logger).getOrThrow({
            name: piece.blockName,
            version: undefined,
            projectId,
            platformId,
        })
    }))

    const uniqueActions = new Set<string>()
    pieces.flatMap(piece => {
        return Object.values(piece.actions).map(action => {
            if (uniqueActions.has(action.name)) {
                return
            }
            
            // Find matching piece in mcp pieces
            const mcpPiece = mcp.pieces.find(p => p.blockName === piece.name)
            const pieceConnectionExternalId = mcpPiece?.connection?.externalId
            var prefix=piece.name.split('piece-')[1]
            if (prefix == undefined) {
                prefix =  'mcp'
            }
            const actionName = `${prefix}-${action.name}`.slice(0, MAX_TOOL_NAME_LENGTH).replace(/\s+/g, '-')
            uniqueActions.add(actionName)
            
            server.tool(
                actionName,
                action.description,
                Object.fromEntries(
                    Object.entries(action.props).filter(([_key, prop]) => 
                        prop.type !== PropertyType.MARKDOWN,
                    ).map(([key, prop]) =>
                        [key, piecePropertyToZod(prop)],
                    ),
                ),
                async (params) => {
                    const parsedInputs = {
                        ...params,
                        ...Object.fromEntries(
                            Object.entries(action.props)
                                .filter(([key, prop]) => !isNil(prop.defaultValue) && isNil(params[key]))
                                .map(([key, prop]) => [key, prop.defaultValue]),
                        ),
                        ...(pieceConnectionExternalId ? { auth: `{{connections['${pieceConnectionExternalId}']}}` } : {}),
                    }
                    
                    const result = await userInteractionWatcher(logger).submitAndWaitForResponse<EngineHelperResponse<ExecuteActionResponse>>({
                        jobType: UserInteractionJobType.EXECUTE_TOOL,
                        actionName: action.name,
                        blockName: piece.name,
                        pieceVersion: piece.version,
                        packageType: piece.packageType,
                        blockType: piece.blockType,
                        input: parsedInputs,
                        projectId,
                    })

                    if (result.status === EngineResponseStatus.OK) {
                        return {
                            content: [{
                                type: 'text',
                                text: `✅ Successfully executed ${action.displayName}\n\n` +
                                    `${action.description}\n\n` +
                                    `\`\`\`json\n${JSON.stringify(result.result, null, 2)}\n\`\`\``,
                            }],
                        }
                    }
                    else {
                        return {
                            content: [{
                                type: 'text',
                                text: `❌ Error executing ${action.displayName}\n\n` +
                                    `${action.description}\n\n` +
                                    `\`\`\`\n${result.standardError || 'Unknown error occurred'}\n\`\`\``,
                            }],
                        }
                    }
                },
            )
        })
    })
}

async function addFlowsToServer(
    server: McpServer,
    mcpId: string,
    logger: FastifyBaseLogger,
): Promise<void> {
    const mcp = await mcpService(logger).getOrThrow({ mcpId })
    const projectId = mcp.projectId

    const flows = await flowService(logger).list({ 
        projectId,
        cursorRequest: null,
        limit: 100,
        folderId: undefined,
        status: [FlowStatus.ENABLED],
        name: undefined,
        versionState: FlowVersionState.LOCKED,
    })

    const mcpFlows = flows.data.filter((flow) => 
        flow.version.trigger.type === TriggerType.PIECE &&
        flow.version.trigger.settings.blockName === '@activepieces/piece-mcp',
    )

    for (const flow of mcpFlows) {
        const triggerSettings = flow.version.trigger.settings as McpTrigger
        const toolName = ('flow-' + triggerSettings.input?.toolName).slice(0, MAX_TOOL_NAME_LENGTH).replace(/\s+/g, '-')
        const toolDescription = triggerSettings.input?.toolDescription
        const inputSchema = triggerSettings.input?.inputSchema
        const returnsResponse = triggerSettings.input?.returnsResponse

        const zodFromInputSchema = Object.fromEntries(
            inputSchema.map((prop) => [prop.name, mcpPropertyToZod(prop)]),
        )

        server.tool(
            toolName,
            toolDescription,
            zodFromInputSchema,
            async (params) => { 
                const response = await webhookService.handleWebhook({
                    data: () => {
                        return Promise.resolve({
                            body: {},
                            method: 'POST',
                            headers: {},
                            queryParams: {},
                        })
                    },
                    logger,
                    flowId: flow.id,
                    async: !returnsResponse,
                    flowVersionToRun: GetFlowVersionForWorkerRequestType.LOCKED,
                    saveSampleData: await webhookSimulationService(logger).exists(
                        flow.id,
                    ),
                    payload: params,
                })
                if (response.status !== StatusCodes.OK) {
                    return {
                        content: [{
                            type: 'text',
                            text: `❌ Error executing flow ${flow.version.displayName}\n\n\`\`\`\n${response || 'Unknown error occurred'}\n\`\`\``,
                        }],
                    }
                }
                return {
                    content: [{
                        type: 'text',
                        text: `✅ Successfully executed flow ${flow.version.displayName}\n\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\``,
                    }],
                }
            },
        )
    }
}

export type CreateMcpServerRequest = {
    mcpId: string
    reply: FastifyReply
    logger: FastifyBaseLogger
}
export type CreateMcpServerResponse = {
    server: McpServer
    transport: SSEServerTransport
}