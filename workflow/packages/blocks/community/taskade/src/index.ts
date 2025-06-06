import { createCustomApiCallAction } from 'workflow-blocks-common';
import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { completeTaskAction } from './lib/actions/complete-task.action';
import { createTaskAction } from './lib/actions/create-task.action';
import { deleteTaskAction } from './lib/actions/delete-task.action';

export const taskadeAuth = PieceAuth.SecretText({
	displayName: 'Personal Token',
	required: true,
	description: `
	1. Navigate to https://taskade.com/settings/password and scroll down to Personal Access Tokens.
	2. Create your personal access token with any name.`,
});

export const taskade = createPiece({
	displayName: 'Taskade',
	auth: taskadeAuth,
	minimumSupportedRelease: '0.30.0',
	categories: [BlockCategory.PRODUCTIVITY],
	description: 'collaboration platform for remote teams to organize and manage projects',
	logoUrl: 'https://cdn.activepieces.com/pieces/taskade.png',
	authors: ['kishanprmr'],
	actions: [
		createTaskAction,
		completeTaskAction,
		deleteTaskAction,
		createCustomApiCallAction({
			baseUrl: () => 'https://www.taskade.com/api/v1',
			auth: taskadeAuth,
			authMapping: async (auth) => ({ Authorization: `Bearer ${auth as string}` }),
		}),
	],
	triggers: [],
});
