import { createCustomApiCallAction } from 'workflow-blocks-common';
import {
    createPiece,
    PieceAuth,
    Property,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { uploadFile } from './lib/actions/upload-file';

const markdown = `
Copy the **URL** and **Service API Key** from your Supabase project settings.
`;
export const supabaseAuth = PieceAuth.CustomAuth({
  required: true,
  description: markdown,
  props: {
    url: Property.ShortText({
      displayName: 'URL',
      required: true,
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      required: true,
    }),
  },
});
export const supabase = createPiece({
  displayName: 'Supabase',
  description: 'The open-source Firebase alternative',
  auth: supabaseAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/supabase.png',
  categories: [BlockCategory.DEVELOPER_TOOLS],
  authors: ["kishanprmr","MoShizzle","abuaboud"],
  actions: [
    uploadFile,
    createCustomApiCallAction({
      baseUrl: (auth) => (auth as { url: string }).url,
      auth: supabaseAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as { apiKey: string }).apiKey}`,
      }),
    }),
  ],
  triggers: [],
});
