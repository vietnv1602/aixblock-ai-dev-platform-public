import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { readConnection } from './lib/actions/read-connection';

export const connections = createPiece({
  displayName: 'Connections',
  description: 'Read connections dynamically',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/connections.png',
  categories: [BlockCategory.CORE],
  auth: PieceAuth.None(),
  authors: ["kishanprmr","AbdulTheActivePiecer","khaledmashaly","abuaboud"],
  actions: [readConnection],
  triggers: [],
});
