import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const getTokenByAddress = createAction({
  name: 'get_token_by_address',
  displayName: 'Get Token by Address',
  description: 'Get token info by its contract address',
  // category: 'Tokens',
  props: {
    addressHash: Property.ShortText({
      displayName: 'Token Address',
      description: 'Contract address of the token to fetch info for',
      required: true,
    }),
  },
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://eth.blockscout.com/api/v2/tokens/${context.propsValue.addressHash}`,
    });
    if (response.status !== 200) {
      throw new Error(`Blockscout API request failed with status ${response.status}`);
    }
    return response.body;
  },
});
