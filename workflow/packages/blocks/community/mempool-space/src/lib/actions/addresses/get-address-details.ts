import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { MEMPOOL_API_BASE_URL } from '../../common';

export const getAddressDetails = createAction({
    name: 'get_address_details',
    displayName: 'Get Address Details',
    description: 'Returns address details including chain and mempool stats',
    // category: 'Addresses',
    props: {
        address: Property.ShortText({
            displayName: 'Address',
            description: 'The Bitcoin address to look up',
            required: true
        })
    },
    async run({ propsValue }) {
        const response = await httpClient.sendRequest({
            method: HttpMethod.GET,
            url: `${MEMPOOL_API_BASE_URL}/api/address/${propsValue.address}`,
        });
        return response.body;
    },
});