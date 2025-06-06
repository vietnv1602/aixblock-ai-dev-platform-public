import { HttpError, HttpMethod } from 'workflow-blocks-common';
import { createAction } from 'workflow-blocks-framework';
import { isNil } from 'workflow-shared';
import { jiraCloudAuth } from '../../auth';
import { jiraApiCall } from '../common';
import { getUsersDropdown, issueIdOrKeyProp } from '../common/props';

export const addWatcherToIssueAction = createAction({
	auth: jiraCloudAuth,
	name: 'add-watcher-to-issue',
	displayName: 'Add Watcher to Issue',
	description: 'Adds a new watcher to an issue.',
	props: {
		issueId: issueIdOrKeyProp('Issue ID or Key', true),
		userId: getUsersDropdown({
			displayName: 'User',
			refreshers: [],
			required: true,
		}),
	},
	async run(context) {
		const { issueId, userId } = context.propsValue;
		if (isNil(issueId)) {
			throw new Error('Issue ID is required');
		}
		if (isNil(userId)) {
			throw new Error('User ID is required');
		}

		try {
			const response = await jiraApiCall({
				auth: context.auth,
				method: HttpMethod.POST,
				resourceUri: `/issue/${issueId}/watchers`,
				body: `"${userId}"`,
			});

			return { success: true };
		} catch (e) {
			return { success: false, error: (e as HttpError).message };
		}
	},
});
