import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { MEMPOOL_API_BASE_URL } from '../../common';

export const getBlock = createAction({
    name: 'get_block',
    displayName: 'Get Block',
    description: 'Returns detailed block information',
    // category: 'Blocks',
    props: {
        hash: Property.ShortText({
            displayName: 'Block Hash',
            description: 'The hash of the block to look up',
            required: true
        })
    },
    async run({ propsValue }) {
        const response = await httpClient.sendRequest({
            method: HttpMethod.GET,
            url: `${MEMPOOL_API_BASE_URL}/api/block/${propsValue.hash}`,
        });
        return response.body;
    },
});