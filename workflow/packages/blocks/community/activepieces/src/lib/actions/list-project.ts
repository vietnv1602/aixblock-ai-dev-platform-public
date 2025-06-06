import { createAction } from 'workflow-blocks-framework';
import {
  AuthenticationType,
  httpClient,
  HttpMethod,
} from 'workflow-blocks-common';
import { activePieceAuth } from '../../index';

export const listProject = createAction({
  name: 'list_project',
  auth: activePieceAuth,
  displayName: 'List Projects',
  description: 'List all projects',
  props: {},
  async run({ auth }) {
    const response = await httpClient.sendRequest<string[]>({
      method: HttpMethod.GET,
      url: `${auth.baseApiUrl}/projects`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: auth.apiKey,
      },
    });

    return response.body;
  },
});
