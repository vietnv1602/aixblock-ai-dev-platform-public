import { Principal, PrincipalType } from 'workflow-shared'
import { FastifyRequest } from 'fastify'
import { BaseSecurityHandler } from '../security-handler'

const ROUTE_PREFIX = '/v1/appsumo'

export class AppSumoAuthnHandler extends BaseSecurityHandler {
    protected canHandle(request: FastifyRequest): Promise<boolean> {
        const routeMatches = request.routerPath.startsWith(ROUTE_PREFIX)
        return Promise.resolve(routeMatches)
    }

    protected async doHandle(request: FastifyRequest): Promise<void> {
        request.principal = this.generatePrincipal()
    }

    private generatePrincipal(): Principal {
        return {
            id: 'app-sumo',
            type: PrincipalType.SERVICE,
            projectId: 'app-sumo',
            platform: {
                id: 'app-sumo',
            },
        }
    }
}
