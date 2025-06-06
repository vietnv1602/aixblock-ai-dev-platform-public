
import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { createSession } from './lib/actions/create-session';
import { getSessionDetails } from './lib/actions/get-session-details';
import { sendMessage } from './lib/actions/send-message';

export const devinAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Your Devin API key (used in the Authorization header).',
});

export const devin = createPiece({
  displayName: 'Devin AI',
  description: 'AI-powered engineering assistant for automating development tasks, code generation, and technical conversations.',
  logoUrl: 'https://cdn.activepieces.com/pieces/devin.png',
  auth: devinAuth,
  categories: [BlockCategory.ARTIFICIAL_INTELLIGENCE],
  minimumSupportedRelease: '0.20.0',
  authors: ['ahmad-swanblocks'],
  actions: [
    createSession,
    getSessionDetails,
    sendMessage,
  ],
  triggers: [],
});    
    