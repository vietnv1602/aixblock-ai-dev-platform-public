import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { sendEmail } from './lib/actions/send-email';

export const mailjetAuth = PieceAuth.BasicAuth({
  description: 'Enter your api credentials',
  required: true,
  username: {
    displayName: 'API Key',
    description: 'Enter your API Key here'
  },
  password: {
    displayName: 'API Secret',
    description: 'Enter your API Secret here'
  }
});

export const mailjet = createPiece({
  displayName: 'Mailjet',
  description: 'Email delivery service for sending transactional and marketing emails',
  auth: mailjetAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/mailjet.svg',
  categories: [BlockCategory.COMMUNICATION],
  authors: ['christian-schab'],
  actions: [sendEmail],
  triggers: []
});
