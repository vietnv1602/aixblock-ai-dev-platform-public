import { FastifyBaseLogger } from 'fastify'
import { PathLike } from 'fs'
import { nanoid } from 'nanoid'
import { copyFile, rename } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { memoryLock, systemConstants } from 'workflow-server-shared'
import { ApEnvironment } from 'workflow-shared'
import { cacheHandler } from './cache-handler'
import { workerMachine } from './machine'

const engineExecutablePath = systemConstants.ENGINE_EXECUTABLE_PATH
const ENGINE_CACHE_ID = nanoid()
const ENGINE_INSTALLED = 'ENGINE_INSTALLED'

/**
 * Installs the engine executable to the given path
 */
export const engineInstaller = (log: FastifyBaseLogger) => ({
    async install({ path }: InstallParams): Promise<void> {
        const lock = await memoryLock.acquire(`engineInstaller#${path}`)
        const isDev = workerMachine.getSettings().ENVIRONMENT === ApEnvironment.DEVELOPMENT

        try {
            log.debug({ path }, '[engineInstaller#install]')
            const cache = cacheHandler(path)
            const isEngineInstalled = await cache.cacheCheckState(ENGINE_INSTALLED) === ENGINE_CACHE_ID
            if (!isEngineInstalled || isDev) {
                await atomicCopy(engineExecutablePath, `${path}/main.js`)
            }
            if (!isEngineInstalled || isDev) {
                await atomicCopy(`${engineExecutablePath}.map`, `${path}/main.js.map`)
            }
            await cache.setCache(ENGINE_INSTALLED, ENGINE_CACHE_ID)
        }
        finally {
            await lock.release()
        }
    },
})

async function atomicCopy(src: PathLike, dest: PathLike): Promise<void> {
    const destDir = dirname(dest.toString())
    const tempPath = join(destDir, 'engine.temp.js')
    await copyFile(src, tempPath)
    await rename(tempPath, dest)
}

type InstallParams = {
    path: string
}
