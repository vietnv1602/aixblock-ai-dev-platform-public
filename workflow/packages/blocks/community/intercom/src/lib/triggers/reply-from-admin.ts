import { createTrigger, TriggerStrategy } from 'workflow-blocks-framework';
import { intercomAuth } from '../..';
import { intercomClient } from '../common';

export const replyFromAdmin = createTrigger({
	name: 'replyFromAdmin',
	displayName: 'Reply from an Intercom admin',
	description: 'Triggers when a reply is received from an Intercom admin (not a user or lead)',
	props: {},
	sampleData: undefined,
	auth: intercomAuth,
	type: TriggerStrategy.APP_WEBHOOK,
	async onEnable(context) {
		const client = intercomClient(context.auth);
		const response = await client.admins.identify();

		if (!response.app?.id_code) {
			throw new Error('Could not find admin id code');
		}
		context.app.createListeners({
			events: ['conversation.admin.replied'],
			identifierValue: response['app']['id_code'],
		});
	},
	async onDisable(context) {
		// implement webhook deletion logic
	},
	async run(context) {
		return [context.payload.body];
	},
});
