import { createAction, Property } from 'workflow-blocks-framework';
import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { talkableAuth } from '../../..';

export const updatePerson = createAction({
  name: 'update_person', // Must be a unique across the piece, this shouldn't be changed.
  auth: talkableAuth,
  displayName: 'Update person',
  description: 'Update person by email',
  props: {
    email: Property.ShortText({
      displayName: 'Person email',
      description: undefined,
      required: true,
    }),
    first_name: Property.ShortText({
      displayName: 'Person first name',
      description: undefined,
      required: false,
    }),
    last_name: Property.ShortText({
      displayName: 'Person last name',
      description: undefined,
      required: false,
    }),
    phone_number: Property.ShortText({
      displayName: 'Person phone number',
      description: undefined,
      required: false,
    }),
    username: Property.ShortText({
      displayName: 'Person username',
      description: undefined,
      required: false,
    }),
    customer_id: Property.Number({
      displayName: 'Customer ID',
      description: undefined,
      required: false,
    }),
    custom_properties: Property.Object({
      displayName: 'Custom properties',
      description: undefined,
      required: false,
    }),
    gated_param_subscribed: Property.Checkbox({
      displayName: 'Opt-in status',
      description: undefined,
      required: false,
    }),
    unsubscribed: Property.Checkbox({
      displayName: 'Unsubscribe status',
      description: undefined,
      required: false,
    }),
    unsubscribed_at: Property.DateTime({
      displayName: 'Unsubscribed date',
      description: undefined,
      required: false,
    }),
  },
  async run(context) {
    const TALKABLE_API_URL = 'https://www.talkable.com/api/v2';
    const { site, api_key } = context.auth;
    const {
      email,
      first_name,
      last_name,
      phone_number,
      username,
      customer_id,
      custom_properties,
      gated_param_subscribed,
      unsubscribed,
      unsubscribed_at,
    } = context.propsValue;
    const personUpdateResponse = await httpClient
      .sendRequest<string[]>({
        method: HttpMethod.PUT,
        url: `${TALKABLE_API_URL}/people/${email}`,
        headers: {
          Authorization: `Bearer ${api_key}`,
          'Content-Type': 'application/json',
        },
        body: {
          site_slug: site,
          data: {
            first_name,
            last_name,
            phone_number,
            username,
            customer_id,
            custom_properties,
            gated_param_subscribed,
            unsubscribed,
            unsubscribed_at,
          },
        },
      });
    return personUpdateResponse.body;
  },
});
