import { FastifyBaseLogger } from 'fastify'
import { AppSystemProp } from 'workflow-server-shared'
import { QueueMode, system } from '../../helper/system/system'
import { memoryConsumer } from '../memory/memory-consumer'
import { redisConsumer } from '../redis/redis-consumer'

const systemMode = system.getOrThrow(AppSystemProp.QUEUE_MODE)
export const flowConsumer = (log: FastifyBaseLogger) => systemMode == QueueMode.MEMORY ? memoryConsumer : redisConsumer(log)