import { createPiece, PieceAuth } from "workflow-blocks-framework";
import { createCustomApiCallAction } from 'workflow-blocks-common';
import { searchCompanies } from "./lib/actions/companies/search";
import { enrichCompanies } from "./lib/actions/companies/enrich";

export const lushaAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Please enter the API Key obtained from Lusha.',
});

export const lusha = createPiece({
  displayName: "Lusha",
  auth: lushaAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/lusha.png",
  authors: ["Kevinyu-alan"],
  actions: [
    searchCompanies,
    enrichCompanies,
    createCustomApiCallAction({
      baseUrl: () => {
        return 'https://api.lusha.com';
      },
      auth: lushaAuth,
      authMapping: async (auth) => ({
        'x-app': 'activepieces',
        'api_key': auth as string,
      }),
    })
  ],
    triggers: [],
});