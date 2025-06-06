import { createAction } from 'workflow-blocks-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from 'workflow-blocks-common';
import { mauticCommon } from '../common';
import { mauticAuth } from '../..';

export const updateContact = createAction({
  auth: mauticAuth,
  description: 'Update a contact in Mautic CRM', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Update Contact With Contact Id',
  name: 'update_mautic_contact',
  props: {
    id: mauticCommon.id,
    fields: mauticCommon.contactFields,
  },
  run: async function (context) {
    const { base_url, username, password } = context.auth;
    const request: HttpRequest = {
      method: HttpMethod.PATCH,
      url: `${base_url.endsWith('/') ? base_url : base_url + '/'}api/contacts/${
        context.propsValue.id
      }/edit`,
      body: JSON.stringify(context.propsValue.fields),
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Content-Type': 'application/json',
      },
    };
    return await httpClient.sendRequest(request);
  },
});
