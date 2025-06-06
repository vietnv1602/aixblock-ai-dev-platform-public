import { createAction, Property } from 'workflow-blocks-framework';
import { sendfoxAuth } from '../../index';
import { callsendfoxApi } from '../../common';
import { HttpMethod } from 'workflow-blocks-common';

export const unsubscribe = createAction({
  name: 'unsubscribe',
  auth: sendfoxAuth,
  displayName: 'Unsubscribe Contact',
  description: 'Unsubscribe a contact',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      required: true,
    }),
  },
  async run(context) {
    const authentication = context.auth;
    const accessToken = authentication;
    const email = context.propsValue.email;
    const response = (
      await callsendfoxApi(HttpMethod.PATCH, 'unsubscribe', accessToken, {
        email: email,
      })
    ).body;
    return [response];
  },
});
