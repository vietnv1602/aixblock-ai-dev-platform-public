import { createAction } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const getTransactions = createAction({
  name: 'get_transactions',
  displayName: 'Get Transactions',
  description: 'Get list of transactions',
  // category: 'Transactions',
  props: {},
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://eth.blockscout.com/api/v2/transactions`,
    });
    if (response.status !== 200) {
      throw new Error(`Blockscout API request failed with status ${response.status}`);
    }
    return response.body;
  },
});
