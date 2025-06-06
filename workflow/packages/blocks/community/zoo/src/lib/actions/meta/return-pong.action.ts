import { createAction } from 'workflow-blocks-framework';
import { zooAuth } from '../../../index'
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const returnPongAction = createAction({
  name: 'return_pong',
  displayName: 'Return Pong',
  description: 'Health check endpoint that returns "pong"',
  auth: zooAuth,
  // category: 'Meta',
  props: {},
  async run({ auth }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: 'https://api.zoo.dev/ping',
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    return response.body;
  },
});
