import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { MEMPOOL_API_BASE_URL } from '../../common';

export const getBlockStatus = createAction({
    name: 'get_block_status',
    displayName: 'Get Block Status',
    description: 'Returns the confirmation status of a block',
    // category: 'Blocks',
    props: {
        hash: Property.ShortText({
            displayName: 'Block Hash',
            description: 'The hash of the block to check status',
            required: true
        })
    },
    async run({ propsValue }) {
        const response = await httpClient.sendRequest({
            method: HttpMethod.GET,
            url: `${MEMPOOL_API_BASE_URL}/api/block/${propsValue.hash}/status`,
        });
        return response.body;
    },
});