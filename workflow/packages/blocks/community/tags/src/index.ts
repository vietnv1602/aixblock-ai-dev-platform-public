import { createPiece, PieceAuth } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { addTag } from './lib/add-tag';

export const tags = createPiece({
  displayName: 'Tags',
  description: 'Add custom tags to your run for filtration',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/tags.svg',
  categories: [BlockCategory.CORE],
  authors: ["kishanprmr","MoShizzle","abuaboud"],
  actions: [addTag],
  triggers: [],
});
