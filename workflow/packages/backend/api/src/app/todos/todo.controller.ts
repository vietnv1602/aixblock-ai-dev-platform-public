import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { StatusCodes } from 'http-status-codes'
import { ALL_PRINCIPAL_TYPES, CreateTodoRequestBody, ListTodoAssigneesRequestQuery, ListTodosQueryParams, PrincipalType, ResolveTodoRequestQuery, SeekPage, UpdateTodoRequestBody, UserWithMetaInformation } from 'workflow-shared'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../helper/pagination'
import { paginationHelper } from '../helper/pagination/pagination-utils'
import { userService } from '../user/user-service'
import { todoService } from './todo.service'


const DEFAULT_CURSOR = null

export const todoController: FastifyPluginAsyncTypebox = async (app) => {
    app.get('/', ListTodosRequest, async (request) => {
        const { platformId, projectId, assigneeId, limit, page, cursor, statusOptions, title } = request.query
        return todoService(request.log).list({
            platformId,
            projectId,
            assigneeId,
            limit: limit ?? DEFAULT_PAGE_SIZE,
            page: page ?? DEFAULT_PAGE,
            cursor: cursor ?? DEFAULT_CURSOR,
            statusOptions,
            title,
        })
    })

    app.get('/:id', GetTodoRequest, async (request) => {
        const { id } = request.params
        return todoService(request.log).getOnePopulatedOrThrow({
            id,
            platformId: request.principal.platform.id,
            projectId: request.principal.projectId,
        })
    })

    app.post('/', CreateTodoRequest, async (request) => {
        const { title, description, statusOptions, flowId, runId, assigneeId, resolveUrl } = request.body
        return todoService(request.log).create({
            title,
            description,
            statusOptions,
            flowId,
            runId,
            assigneeId,
            resolveUrl,
            platformId: request.principal.platform.id,
            projectId: request.principal.projectId,
        })
    })

    app.post('/:id', UpdateTodoRequest, async (request) => {
        const { id } = request.params
        const { title, description, status, statusOptions, assigneeId, isTest } = request.body
        return todoService(request.log).update({
            id,
            title,
            description,
            status,
            statusOptions,
            assigneeId,
            platformId: request.principal.platform.id,
            projectId: request.principal.projectId,
            isTest,
        })
    })
    
    app.all('/:id/resolve', RequestResolveTodoRequest, async (request) => {
        const { id } = request.params
        const { status, isTest } = request.query
        return todoService(request.log).resolve({
            id,
            status,
            isTest,
        })
    })

    app.get('/assignees', ListTodoAssigneesRequest, async (request) => {
        const users = await userService.listProjectUsers({
            platformId: request.principal.platform.id,
            projectId: request.principal.projectId,
        })
        return paginationHelper.createPage(users, null)
    })


}


const ListTodoAssigneesRequest = {
    schema: {
        querystring: ListTodoAssigneesRequestQuery,
        response: {
            [StatusCodes.OK]: SeekPage(UserWithMetaInformation),
        },
    },
    config: {
        allowedPrincipals: [PrincipalType.ENGINE],
    },

}


const ListTodosRequest = {
    schema: {
        querystring: ListTodosQueryParams,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}

const CreateTodoRequest = {
    schema: {
        body: CreateTodoRequestBody,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE, PrincipalType.ENGINE],
    },
}

const RequestResolveTodoRequest = {
    schema: {
        params: Type.Object({
            id: Type.String(),
        }),
        querystring: ResolveTodoRequestQuery,
    },
    config: {
        allowedPrincipals: ALL_PRINCIPAL_TYPES,
    },
}

const GetTodoRequest = {
    schema: {
        params: Type.Object({
            id: Type.String(),
        }),
    },
    config: {
        allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE, PrincipalType.ENGINE],
    },
}

const UpdateTodoRequest = {
    schema: {
        params: Type.Object({
            id: Type.String(),
        }),
        body: UpdateTodoRequestBody,
    },
    config: {
        allowedPrincipals: [PrincipalType.USER],
    },
}
