import { createCustomApiCallAction } from 'workflow-blocks-common';
import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { triggers } from './lib/triggers';

const markdownPropertyDescription = `
**Enable Basic Authentication:**

1. Go to https://developer.frame.io/app/tokens
2. Click on 'Create a Token'
3. Provide a Description for your use.
4. Depending on your usage, you may 'Select all scopes'
5. Submit the form
6. The token will be created. Copy the token and paste it in the 'Token' input
`;

export const frameAuth = PieceAuth.SecretText({
  displayName: 'Token',
  description: markdownPropertyDescription,
  required: true,
});

export const frame = createPiece({
  displayName: 'Frame',
  description: 'Collaborative workspace platform',

  auth: frameAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/frameio.png',
  categories: [BlockCategory.MARKETING],
  authors: ["kanarelo","kishanprmr","MoShizzle","abuaboud"],
  actions: [
    createCustomApiCallAction({
      baseUrl: () => 'https://api.frame.io/v2',
      auth: frameAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth}`,
      }),
    }),
  ],
  triggers,
});
