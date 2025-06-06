import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const getAddressTokenBalances = createAction({
  name: 'get_address_token_balances',
  displayName: 'Get Address Token Balances',
  description: 'Get list of token balances for an address',
  // category: 'Addresses',
  props: {
    addressHash: Property.ShortText({
      displayName: 'Address Hash',
      description: 'Hash of the address to fetch token balances for',
      required: true,
    }),
  },
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://eth.blockscout.com/api/v2/addresses/${context.propsValue.addressHash}/token-balances`,
    });
    if (response.status !== 200) {
      throw new Error(`Blockscout API request failed with status ${response.status}`);
    }
    return response.body;
  },
});
