import { createAction } from 'workflow-blocks-framework';
import { HttpMethod, httpClient } from 'workflow-blocks-common';

import { retableAuth } from '../..';
import { retableCommon } from '../common';

export const retableGetAllWorkspacesAction = createAction({
  auth: retableAuth,
  name: 'retable_get_workspaces',
  displayName: 'Get Workspaces',
  description: 'Gets all workspaces',
  props: {},
  async run(context) {
    return (
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `${retableCommon.baseUrl}/workspace`,
        headers: {
          ApiKey: context.auth as string,
        },
      })
    ).body;
  },
});
