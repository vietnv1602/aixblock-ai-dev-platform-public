import { FastifyBaseLogger } from 'fastify'
import { JobType, UserInteractionJobDataWithoutWatchingInformation } from 'workflow-server-shared'
import { apId } from 'workflow-shared'
import { engineResponseWatcher } from './engine-response-watcher'
import { jobQueue } from './queue'

export const userInteractionWatcher = (log: FastifyBaseLogger) => ({
    submitAndWaitForResponse: async <T>(request: UserInteractionJobDataWithoutWatchingInformation): Promise<T> => {
        const requestId = apId()
        await jobQueue(log).add({
            id: apId(),
            type: JobType.USERS_INTERACTION,
            data: {
                ...request,
                requestId,
                webserverId: engineResponseWatcher(log).getServerId(),
            },
        })
        return engineResponseWatcher(log).oneTimeListener<T>(requestId, false, undefined, undefined)
    },
})