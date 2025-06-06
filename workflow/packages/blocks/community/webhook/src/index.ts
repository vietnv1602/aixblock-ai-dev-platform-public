import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { catchWebhook } from './lib/triggers/catch-hook';
import { BlockCategory } from 'workflow-shared';
import { returnResponse } from './lib/actions/return-response';

export const webhook = createPiece({
  displayName: 'Webhook',
  description: 'Receive HTTP requests and trigger flows using unique URLs.',
  auth: PieceAuth.None(),
  categories: [BlockCategory.CORE],
  minimumSupportedRelease: '0.46.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/webhook.svg',
  authors: ['abuaboud', 'pfernandez98', 'kishanprmr'],
  actions: [returnResponse],
  triggers: [catchWebhook],
});
