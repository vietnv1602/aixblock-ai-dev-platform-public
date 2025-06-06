import { createCustomApiCallAction } from "workflow-blocks-common";
import { createPiece, PieceAuth, PiecePropValueSchema, Property } from "workflow-blocks-framework";
import { BlockCategory } from "workflow-shared";
import { createPageFromTemplateAction } from "./lib/actions/create-page-from-template";
import { getPageContent } from "./lib/actions/get-page-content";
import { newPageTrigger } from "./lib/triggers/new-page";

export const confluenceAuth = PieceAuth.CustomAuth({
  description: 'Please refer to this guide to get your api credentials: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account',
  required: true,
  props: {
    username: PieceAuth.SecretText({
      displayName: 'Account Email',
      required: true,
      description: 'Account email for basic auth',
    }),
    password: PieceAuth.SecretText({
      displayName: 'API token',
      required: true,
      description: 'API token for basic auth',
    }),
    confluenceDomain: Property.ShortText({
      displayName: 'Confluence Domain',
      required: true,
      description: 'Example value - https://your-domain.atlassian.net',
    }),
  },
});

export const confluence = createPiece({
  displayName: "Confluence",
  auth: confluenceAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: "https://cdn.activepieces.com/pieces/confluence.png",
  authors: ["geekyme"],
  actions: [getPageContent,createPageFromTemplateAction,
    createCustomApiCallAction({
      baseUrl:(auth)=>{
        const authValue = auth as PiecePropValueSchema<typeof confluenceAuth>;
        return `${authValue.confluenceDomain}/wiki/api/v2`;
      },
      auth: confluenceAuth,
      authMapping: async (auth) => {
        const authValue = auth as PiecePropValueSchema<typeof confluenceAuth>;
        return {
          Authorization: `Basic ${Buffer.from(`${authValue.username}:${authValue.password}`).toString('base64')}`,
        };
      },
    })
  ],
  categories: [BlockCategory.CONTENT_AND_FILES],
  triggers: [newPageTrigger],
});
