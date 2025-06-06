import { mailchimpCommon } from '../common';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { createAction, Property } from 'workflow-blocks-framework';
import { mailchimpAuth } from '../..';

export const updateSubscriberInList = createAction({
  auth: mailchimpAuth,
  name: 'update_member_in_list',
  displayName: 'Update Member in an Audience (List)',
  description: 'Update a member in an existing Mailchimp audience (list)',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      description: 'Email of the new contact',
      required: true,
    }),
    list_id: mailchimpCommon.mailChimpListIdDropdown,
    status: Property.StaticDropdown<
      'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional'
    >({
      displayName: 'Status',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'Subscribed', value: 'subscribed' },
          { label: 'Unsubscribed', value: 'unsubscribed' },
          { label: 'Cleaned', value: 'cleaned' },
          { label: 'Pending', value: 'pending' },
          { label: 'Transactional', value: 'transactional' },
        ],
      },
    }),
  },
  async run(context) {
    const access_token = context.auth.access_token;
    const mailChimpServerPrefix =
      await mailchimpCommon.getMailChimpServerPrefix(access_token);
    mailchimp.setConfig({
      accessToken: access_token,
      server: mailChimpServerPrefix,
    });
    return await mailchimp.lists.updateListMember(
      context.propsValue.list_id!,
      context.propsValue.email!,
      {
        status: context.propsValue.status!,
      }
    );
  },
});
