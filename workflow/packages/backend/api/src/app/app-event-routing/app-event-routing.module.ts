import { facebookLeads } from '@activepieces/piece-facebook-leads'
import { intercom } from '@activepieces/piece-intercom'
import { slack } from '@activepieces/piece-slack'
import { square } from '@activepieces/piece-square'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { Piece } from 'workflow-blocks-framework'
import {
    JobType,
    LATEST_JOB_DATA_SCHEMA_VERSION,
    rejectedPromiseHandler,
} from 'workflow-server-shared'
import {
    AIxBlockError,
    ALL_PRINCIPAL_TYPES,
    apId,
    assertNotNullOrUndefined,
    ErrorCode,
    GetFlowVersionForWorkerRequestType,
    isNil,
} from 'workflow-shared'
import { webhookSimulationService } from '../webhooks/webhook-simulation/webhook-simulation-service'
import { jobQueue } from '../workers/queue'
import { DEFAULT_PRIORITY } from '../workers/queue/queue-manager'
import { appEventRoutingService } from './app-event-routing.service'

const appWebhooks: Record<string, Piece> = {
    slack,
    square,
    'facebook-leads': facebookLeads,
    intercom,
}
const blockNames: Record<string, string> = {
    slack: '@activepieces/piece-slack',
    square: '@activepieces/piece-square',
    'facebook-leads': '@activepieces/piece-facebook-leads',
    intercom: '@activepieces/piece-intercom',
}

export const appEventRoutingModule: FastifyPluginAsyncTypebox = async (app) => {
    await app.register(appEventRoutingController, { prefix: '/v1/app-events' })
}

export const appEventRoutingController: FastifyPluginAsyncTypebox = async (
    fastify,
) => {
    fastify.all(
        '/:pieceUrl',
        {
            config: {
                rawBody: true,
                allowedPrincipals: ALL_PRINCIPAL_TYPES,
            },
        },
        async (
            request: FastifyRequest<{
                Body: unknown
                Params: {
                    pieceUrl: string
                }
            }>,
            requestReply,
        ) => {
            const pieceUrl = request.params.pieceUrl
            const payload = {
                headers: request.headers as Record<string, string>,
                body: request.body,
                rawBody: request.rawBody,
                method: request.method,
                queryParams: request.query as Record<string, string>,
            }
            const piece = appWebhooks[pieceUrl]
            if (isNil(piece)) {
                throw new AIxBlockError({
                    code: ErrorCode.BLOCK_NOT_FOUND,
                    params: {
                        blockName: pieceUrl,
                        pieceVersion: 'latest',
                        message: 'Pieces is not found in app event routing',
                    },
                })
            }
            const appName = blockNames[pieceUrl]
            assertNotNullOrUndefined(piece.events, 'Event is possible in this piece')
            const { reply, event, identifierValue } = piece.events.parseAndReply({
                payload,
            })
            if (!isNil(reply)) {
                request.log.info(
                    {
                        reply,
                        piece: pieceUrl,
                    },
                    '[AppEventRoutingController#event] reply',
                )
                return requestReply
                    .status(StatusCodes.OK)
                    .headers(reply?.headers ?? {})
                    .send(reply?.body ?? {})
            }
            request.log.info(
                {
                    event,
                    identifierValue,
                },
                '[AppEventRoutingController#event] event',
            )
            if (isNil(event) || isNil(identifierValue)) {
                return requestReply.status(StatusCodes.BAD_REQUEST).send({})
            }
            const listeners = await appEventRoutingService.listListeners({
                appName,
                event,
                identifierValue,
            })
            const eventsQueue = listeners.map(async (listener) => {
                const requestId = apId()
                return jobQueue(request.log).add({
                    id: requestId,
                    type: JobType.WEBHOOK,
                    data: {
                        projectId: listener.projectId,
                        schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
                        requestId,
                        synchronousHandlerId: null,
                        payload,
                        flowId: listener.flowId,
                        saveSampleData: await webhookSimulationService(request.log).exists(listener.flowId),
                        flowVersionToRun: GetFlowVersionForWorkerRequestType.LOCKED,
                    },
                    priority: DEFAULT_PRIORITY,
                })
            })
            rejectedPromiseHandler(Promise.all(eventsQueue), request.log)
            return requestReply.status(StatusCodes.OK).send({})
        },
    )
}
