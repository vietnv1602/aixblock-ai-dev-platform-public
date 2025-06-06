import { createAction, Property } from 'workflow-blocks-framework';
import { zooAuth } from '../../../index'
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const createServiceAccountAction = createAction({
  name: 'create_service_account',
  displayName: 'Create Service Account',
  description: 'Create a new service account for your organization',
  auth: zooAuth,
  // category: 'Service Accounts',
  props: {
    name: Property.ShortText({
      displayName: 'Name',
      required: true,
      description: 'Name for the service account',
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: 'https://api.zoo.dev/org/service-accounts',
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      body: {
        name: propsValue.name,
      },
    });
    return response.body;
  },
});
