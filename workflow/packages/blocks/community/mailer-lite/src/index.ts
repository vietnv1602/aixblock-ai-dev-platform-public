import { createCustomApiCallAction } from 'workflow-blocks-common';
import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { addSubscriberToGroupAction } from './lib/actions/add-subscriber-to-group';
import { createOrUpdateSubscriber } from './lib/actions/create-or-update-subscription';
import { findSubscriberAction } from './lib/actions/find-subscriber';
import { removeSubscriberFromGroupAction } from './lib/actions/remove-subscriber-from-group';
import { triggers } from './triggers/triggers';

const markdownDescription = `
To obtain your API key, follow these steps:

1. Log in to your MailerLite account.
2. Visit the [API page](https://dashboard.mailerlite.com/integrations/api).
3. Click the **Generate new token** button.
4. Copy the generated API key.
`;

export const mailerLiteAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: markdownDescription,
  required: true,
});

export const mailerLite = createPiece({
  displayName: 'MailerLite',
  description: 'Email marketing software',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/mailer-lite.png',
  categories: [BlockCategory.MARKETING],
  authors: ["Willianwg","kanarelo","kishanprmr","khaledmashaly","abuaboud"],
  auth: mailerLiteAuth,
  actions: [
    addSubscriberToGroupAction,
    createOrUpdateSubscriber,
    findSubscriberAction,
    removeSubscriberFromGroupAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://connect.mailerlite.com/',
      auth: mailerLiteAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth}`,
      }),
    }),
  ],
  triggers,
});
