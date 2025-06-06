import {
    createPiece,
    PieceAuth,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { getCallDetailsAction } from './lib/actions/get-call-details';
import { makeCallAction } from './lib/actions/make-call';

const authDescription = `
Follow these steps to obtain your Kallbot API Key:

1. Go to [Kallabot](https://kallabot.com/) and log in to your account.
2. Click on your profile picture in the top right corner.
3. Select **Settings** from the dropdown menu.
4. Navigate to the **API & Integrations** tab.
5. Copy the generated API key and paste it here.
`;

export const kallabotAuth = PieceAuth.SecretText({
  description: authDescription,
  displayName: 'API Key',
  required: true
});

export const kallabotAi = createPiece({
  displayName: 'Kallabot',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/kallabot-ai.png',
  categories: [BlockCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['abdulrahmanmajid'],
  auth: kallabotAuth,
  actions: [makeCallAction, getCallDetailsAction],
  triggers: [],
  description: 'AI-powered voice agents and conversational interfaces.',
});
