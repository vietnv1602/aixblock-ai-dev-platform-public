import { FastifyInstance } from 'fastify'
import { flowWorker, piecesBuilder } from 'server-worker'
import { AppSystemProp, BlocksSource, WorkerSystemProp } from 'workflow-server-shared'
import { isNil } from 'workflow-shared'
import { accessTokenManager } from './authentication/lib/access-token-manager'
import { system } from './helper/system/system'

export const setupWorker = async (app: FastifyInstance): Promise<void> => {

    const piecesSource = system.getOrThrow<BlocksSource>(AppSystemProp.BLOCKS_SOURCE)
    const devPieces = system.get(AppSystemProp.DEV_BLOCKS)?.split(',') ?? []
    await piecesBuilder(app, app.io, devPieces, piecesSource)
    app.addHook('onClose', async () => {
        await flowWorker(app.log).close()
    })
}

export async function workerPostBoot(app: FastifyInstance): Promise<void> {
    const workerToken = await generateWorkerToken()
    await flowWorker(app.log).init({ workerToken })
}



async function generateWorkerToken(): Promise<string> {
    const workerToken = system.get(WorkerSystemProp.WORKER_TOKEN)
    if (!isNil(workerToken)) {
        return workerToken
    }
    return accessTokenManager.generateWorkerToken()
}