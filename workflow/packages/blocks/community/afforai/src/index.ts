import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { askChatbotAction } from './lib/actions/ask-chatbot';

export const afforaiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: `
  To obtain your API Key, follow these steps:
  1. Log in to your Afforai account.
  2. Navigate to **API** section on left panel.
  3. On the top-right, you can find you API key.
  `,
});
export const afforai = createPiece({
  displayName: 'Afforai',
  description:
    'Helps you search, summarize, and translate knowledge from hundreds of documents to help you produce trustworthy research.',
  auth: afforaiAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/afforai.png',
  categories: [BlockCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ["kishanprmr","abuaboud"],
  actions: [askChatbotAction],
  triggers: [],
});
