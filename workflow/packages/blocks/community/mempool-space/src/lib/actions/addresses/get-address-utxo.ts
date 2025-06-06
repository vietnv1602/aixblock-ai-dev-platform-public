import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { MEMPOOL_API_BASE_URL } from '../../common';

export const getAddressUtxo = createAction({
    name: 'get_address_utxo',
    displayName: 'Get Address UTXO',
    description: 'Returns unspent transaction outputs for an address',
    // category: 'Addresses',
    props: {
        address: Property.ShortText({
            displayName: 'Address',
            description: 'The Bitcoin address to look up UTXOs for',
            required: true
        })
    },
    async run({ propsValue }) {
        const response = await httpClient.sendRequest({
            method: HttpMethod.GET,
            url: `${MEMPOOL_API_BASE_URL}/api/address/${propsValue.address}/utxo`,
        });
        return response.body;
    },
});