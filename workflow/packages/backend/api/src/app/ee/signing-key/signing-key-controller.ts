import {
    FastifyPluginAsyncTypebox,
    Type,
} from '@fastify/type-provider-typebox'
import { StatusCodes } from 'http-status-codes'
import { AddSigningKeyRequestBody, ApplicationEventName } from 'workflow-axb-shared'
import {
    AIxBlockError,
    ApId,
    assertNotNullOrUndefined,
    ErrorCode,
    isNil,
} from 'workflow-shared'
import { eventsHooks } from '../../helper/application-events'
import { signingKeyService } from './signing-key-service'

export const signingKeyController: FastifyPluginAsyncTypebox = async (app) => {
    app.post('/', AddSigningKeyRequest, async (req, res) => {
        const platformId = req.principal.platform.id
        const newSigningKey = await signingKeyService.add({
            platformId,
            displayName: req.body.displayName,
        })

        eventsHooks.get(req.log).sendUserEventFromRequest(req, {
            action: ApplicationEventName.SIGNING_KEY_CREATED,
            data: {
                signingKey: newSigningKey,
            },
        })

        return res.status(StatusCodes.CREATED).send(newSigningKey)
    })

    app.get('/', {}, async (req) => {
        const platformId = req.principal.platform.id
        assertNotNullOrUndefined(platformId, 'platformId')
        return signingKeyService.list({
            platformId,
        })
    })

    app.get('/:id', GetSigningKeyRequest, async (req) => {
        const platformId = req.principal.platform.id
        assertNotNullOrUndefined(platformId, 'platformId')
        const signingKey = await signingKeyService.get({
            id: req.params.id,
        })
        if (isNil(signingKey)) {
            throw new AIxBlockError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: {
                    message: `SigningKey with id ${req.params.id} not found`,
                },
            })
        }
        return signingKey
    })

    app.delete('/:id', DeleteSigningKeyRequest, async (req, res) => {
        const platformId = req.principal.platform.id
        assertNotNullOrUndefined(platformId, 'platformId')
        await signingKeyService.delete({
            id: req.params.id,
            platformId,
        })
        return res.status(StatusCodes.OK).send()
    })
}

const AddSigningKeyRequest = {
    schema: {
        body: AddSigningKeyRequestBody,
    },
}

const GetSigningKeyRequest = {
    schema: {
        params: Type.Object({
            id: ApId,
        }),
    },
}

const DeleteSigningKeyRequest = {
    schema: {
        params: Type.Object({
            id: ApId,
        }),
    },
}
