import {
    AI_PROVIDERS_MAKRDOWN,
    createCustomApiCallAction,
} from 'workflow-blocks-common';
import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { extractStructuredDataAction } from './lib/actions/extract-structured-data';
import { askClaude } from './lib/actions/send-prompt';
import { baseUrl } from './lib/common/common';

export const claudeAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: AI_PROVIDERS_MAKRDOWN.anthropic,
});

export const claude = createPiece({
  displayName: 'Anthropic Claude',
  auth: claudeAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/claude.png',
  categories: [BlockCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['dennisrongo','kishanprmr'],
  actions: [
    askClaude,
    extractStructuredDataAction,
    createCustomApiCallAction({
      auth: claudeAuth,
      baseUrl: () => baseUrl,
      authMapping: async (auth) => {
        return {
          'x-api-key': `${auth}`,
        };
      },
    }),
  ],
  triggers: [],
});
