import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const getTokenCounters = createAction({
  name: 'get_token_counters',
  displayName: 'Get Token Counters',
  description: 'Get token counters (holders count, transfers count, etc.)',
  // category: 'Tokens',
  props: {
    addressHash: Property.ShortText({
      displayName: 'Token Address',
      description: 'Contract address of the token to fetch counters for',
      required: true,
    }),
  },
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://eth.blockscout.com/api/v2/tokens/${context.propsValue.addressHash}/counters`,
    });
    if (response.status !== 200) {
      throw new Error(`Blockscout API request failed with status ${response.status}`);
    }
    return response.body;
  },
});
