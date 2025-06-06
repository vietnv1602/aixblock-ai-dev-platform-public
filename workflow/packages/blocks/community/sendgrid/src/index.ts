import { createCustomApiCallAction } from 'workflow-blocks-common';
import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { sendDynamicTemplate } from './lib/actions/send-dynamic-template';
import { sendEmail } from './lib/actions/send-email';
import { sendgridCommon } from './lib/common';

export const sendgridAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'API key acquired from your SendGrid settings',
});

export const sendgrid = createPiece({
  displayName: 'SendGrid',
  description:
    'Email delivery service for sending transactional and marketing emails',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/sendgrid.png',
  authors: ["ashrafsamhouri","kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  categories: [BlockCategory.COMMUNICATION, BlockCategory.MARKETING],
  auth: sendgridAuth,
  actions: [
    sendEmail,
    sendDynamicTemplate,
    createCustomApiCallAction({
      baseUrl: () => sendgridCommon.baseUrl,
      auth: sendgridAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth}`,
      }),
    }),
  ],
  triggers: [],
});
