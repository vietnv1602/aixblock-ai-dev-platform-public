import dayjs from 'dayjs'
import { FastifyBaseLogger } from 'fastify'
import { AppSystemProp } from 'workflow-server-shared'
import { AIxBlockError, ApEdition, Changelog, ErrorCode, ListChangelogsResponse } from 'workflow-shared'
import { distributedStore } from '../helper/keyvalue'
import { system } from '../helper/system/system'

const CHANGELOG_KEY = 'changelogs'

type ChangelogStore = {
    lastFetched: string
    data: ListChangelogsResponse
}

const emptyChangelog: ListChangelogsResponse = {
    data: [],
}

export const changelogService = (logger: FastifyBaseLogger) => ({
    async list(): Promise<ListChangelogsResponse> {
        const changelogs: ChangelogStore = await distributedStore().get(CHANGELOG_KEY) ?? {
            lastFetched: dayjs().subtract(1, 'day').toISOString(),
            data: emptyChangelog,
        }
        if (dayjs(changelogs.lastFetched).isBefore(dayjs().subtract(1, 'day'))) {
            const newChangelogs = await getChangelog(logger)
            const changelogStore: ChangelogStore = {
                lastFetched: dayjs().toISOString(),
                data: newChangelogs,
            }
            await distributedStore().put(CHANGELOG_KEY, changelogStore)
            return newChangelogs
        }
        return changelogs.data
    },
})
async function getChangelog(logger: FastifyBaseLogger): Promise<ListChangelogsResponse> {
    const isCloudEdition = system.getOrThrow(AppSystemProp.EDITION) === ApEdition.CLOUD
    try {
        if (isCloudEdition) {
            return await getChangelogFeaturebaseRequest()
        } 
        return {
            data: []
        }
    }
    catch (error) {
        logger.error('Error fetching changelog', error)
        return {
            data: [],
        }
    }
}

async function getChangelogFeaturebaseRequest(): Promise<ListChangelogsResponse> {
    const featurebaseApiKey = system.getOrThrow(AppSystemProp.FEATUREBASE_API_KEY)
    const results = []
    let page = 1
    const limit = 100
    let totalPages = 1
    
    do {
        const queryparams = new URLSearchParams()
        queryparams.append('state', 'live')
        queryparams.append('limit', limit.toString())
        queryparams.append('page', page.toString())
        
        const url = new URL(`https://do.featurebase.app/v2/changelog?${queryparams.toString()}`)
        const headers = new Headers()
        headers.append('X-API-Key', featurebaseApiKey)

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers,
        })
        if (!response.ok) {
            throw new AIxBlockError({
                code: ErrorCode.VALIDATION,
                params: {
                    message: 'Could not fetch changelog',
                },
            })
        }
        const data = await response.text()
        const parsedData = JSON.parse(data)
        if (parsedData.totalPages) {
            totalPages = parsedData.totalPages
        }
        
        // Map the results to match the Changelog type
        const mappedResults = parsedData.results.map((item: Changelog) => {
            const changelog: Changelog = {
                title: item.title,
                featuredImage: item.featuredImage || '',
                markdownContent: item.markdownContent,
                date: item.date,
            }
            return changelog
        })
        
        results.push(...mappedResults)
        page++
    } while (page <= totalPages)
    return {
        data: results,
    }
}
