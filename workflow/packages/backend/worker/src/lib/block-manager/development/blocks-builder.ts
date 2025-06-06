import chalk from 'chalk'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import { FastifyBaseLogger, FastifyInstance } from 'fastify'
import { Server } from 'http'
import path, { resolve } from 'path'
import { ApLock, BlocksSource, fileBlocksUtils, memoryLock } from 'workflow-server-shared'
import { debounce, isNil, WebsocketClientEvent } from 'workflow-shared'
import { cacheHandler } from '../../utils/cache-handler'

export const PIECES_BUILDER_MUTEX_KEY = 'pieces-builder'

const globalCachePath = path.resolve('cache')

enum CacheState {
    READY = 'READY',
    PENDING = 'PENDING',
}

async function handleFileChange(packages: string[], pieceProjectName: string, piecePackageName: string, io: Server, log: FastifyBaseLogger): Promise<void> {
    log.info(
        chalk.blueBright.bold(
            '👀 Detected changes in pieces. Waiting... 👀 ' + pieceProjectName,
        ),
    )
    let lock: ApLock | undefined
    try {
        lock = await memoryLock.acquire(PIECES_BUILDER_MUTEX_KEY)

        log.info(chalk.blue.bold('🤌 Building pieces... 🤌'))
        if (!/^[A-Za-z0-9-]+$/.test(pieceProjectName)) {
            throw new Error(`Piece package name contains invalid character: ${pieceProjectName}`)
        }
        const cmd = `npx nx run-many -t build --projects=${pieceProjectName}`
        await runCommandWithLiveOutput(cmd)
        await fileBlocksUtils(packages, log).clearBlockCache(piecePackageName)

        const cache = cacheHandler(globalCachePath)
        await cache.setCache('workflow-blocks-framework', CacheState.PENDING)
        await cache.setCache('workflow-blocks-common', CacheState.PENDING)
        await cache.setCache('workflow-shared', CacheState.PENDING)
        await cache.setCache(piecePackageName, CacheState.PENDING)

        io.emit(WebsocketClientEvent.REFRESH_PIECE)
    }
    catch (error) {
        log.info(error, chalk.red.bold('Failed to run build process...'))
    }
    finally {
        if (lock) {
            await lock.release()
        }
        log.info(
            chalk.green.bold(
                '✨ Changes are ready! Please refresh the frontend to see the new updates. ✨',
            ),
        )
    }
}

async function runCommandWithLiveOutput(cmd: string): Promise<void> {
    const [command, ...args] = cmd.split(' ')

    return new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit', shell: true })

        child.on('error', reject)
        child.on('close', code => {
            if (code === 0) {
                resolve()
            }
            else {
                reject(new Error(`Process exited with code ${code}`))
            }
        })
    })
}

export async function piecesBuilder(app: FastifyInstance, io: Server, packages: string[], piecesSource: BlocksSource): Promise<void> {

    const isFilePieces = piecesSource === BlocksSource.FILE
    // Only run this script if the pieces source is file
    if (!isFilePieces) return

    const watchers: chokidar.FSWatcher[] = []

    for (const packageName of packages) {
        app.log.info(chalk.blue(`Starting watch for package: ${packageName}`))

        const pieceDirectory = await fileBlocksUtils(packages, app.log).findBlockDirectoryByFolderName(packageName)
        if (isNil(pieceDirectory)) {
            app.log.info(chalk.yellow(`Piece directory not found for package: ${packageName}`))
            continue
        }
        app.log.info(chalk.yellow(`Found piece directory: ${pieceDirectory}`))

        const pieceProjectName = `blocks-${packageName}`
        const packageJsonName = await fileBlocksUtils(packages, app.log).getPackageNameFromFolderPath(pieceDirectory)
        const debouncedHandleFileChange = debounce(() => {
            handleFileChange(packages, pieceProjectName, packageJsonName, io, app.log).catch(app.log.error)
        }, 2000)

        const watcher = chokidar.watch(resolve(pieceDirectory), {
            ignored: [/^\./, /node_modules/, /dist/],
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 200,
            },
        })
        watcher.on('ready', debouncedHandleFileChange)
        watcher.on('all', (event, path) => {
            if (path.endsWith('.ts') || path.endsWith('package.json')) {
                debouncedHandleFileChange()
            }
        })

        watchers.push(watcher)
    }


    app.addHook('onClose', () => {
        for (const watcher of watchers) {
            watcher.close().catch(app.log.error)
        }
    })
}
