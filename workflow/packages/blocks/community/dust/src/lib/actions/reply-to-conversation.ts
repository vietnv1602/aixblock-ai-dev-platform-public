import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from 'workflow-blocks-common';
import { createAction, Property } from 'workflow-blocks-framework';
import { dustAuth } from '../..';
import {
  assistantProp,
  DUST_BASE_URL,
  getConversationContent,
  timeoutProp,
  timezoneProp,
  usernameProp,
} from '../common';

export const replyToConversation = createAction({
  name: 'replyToConversation',
  displayName: 'Reply to conversation',
  description: 'Send reply to existing conversation',
  auth: dustAuth,
  props: {
    conversationId: Property.ShortText({
      displayName: 'Conversation ID',
      required: true,
    }),
    assistant: assistantProp,
    query: Property.LongText({ displayName: 'Query', required: true }),
    username: usernameProp,
    timezone: timezoneProp,
    timeout: timeoutProp,
  },
  async run({ auth, propsValue }) {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${DUST_BASE_URL}/${auth.workspaceId}/assistant/conversations/${propsValue.conversationId}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.apiKey}`,
      },
      body: JSON.stringify(
        {
          content: propsValue.query,
          mentions: [{ configurationId: propsValue.assistant }],
          context: {
            timezone: propsValue.timezone,
            username: propsValue.username,
            email: null,
            fullName: null,
            profilePictureUrl: null,
          },
        },
        (key, value) => (typeof value === 'undefined' ? null : value)
      ),
    };
    await httpClient.sendRequest(request);
    return await getConversationContent(
      propsValue.conversationId,
      propsValue.timeout,
      auth
    );
  },
});
