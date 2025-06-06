import { createAction } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const getTokens = createAction({
  name: 'get_tokens',
  displayName: 'Get Tokens',
  description: 'Get list of tokens',

  // category: 'Tokens',
  props: {},
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://eth.blockscout.com/api/v2/tokens`,
    });
    if (response.status !== 200) {
      throw new Error(`Blockscout API request failed with status ${response.status}`);
    }
    return response.body;
  },
});
