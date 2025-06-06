import { createAction, Property } from 'workflow-blocks-framework';
import { getConversationContent, timeoutProp } from '../common';
import { dustAuth } from '../..';

export const getConversation = createAction({
  name: 'getConversation',
  displayName: 'Get existing conversation',
  description: 'Get an existing conversation',
  auth: dustAuth,
  props: {
    conversationSid: Property.ShortText({
      displayName: 'Conversation sID',
      required: true,
    }),
    timeout: timeoutProp,
  },
  async run({ auth, propsValue }) {
    return await getConversationContent(
      propsValue.conversationSid,
      propsValue.timeout,
      auth
    );
  },
});
