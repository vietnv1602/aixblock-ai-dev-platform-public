import { createAction } from 'workflow-blocks-framework';
import { assertNotNullOrUndefined } from 'workflow-shared';
import { slackAuth } from '../..';
import {
    actions,
    profilePicture,
    singleSelectChannelInfo,
    slackChannel,
    text,
    username,
} from '../common/props';
import { requestAction } from '../common/request-action';

export const requestActionMessageAction = createAction({
  auth: slackAuth,
  name: 'request_action_message',
  displayName: 'Request Action in A Channel',
  description:
    'Send a message in a channel and wait until an action is selected',
  props: {
    info: singleSelectChannelInfo,
    channel: slackChannel(true),
    text,
    actions,
    username,
    profilePicture,
  },
  async run(context) {
    const { channel } = context.propsValue;
    assertNotNullOrUndefined(channel, 'channel');

    return await requestAction(channel, context);
  },
});
