import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { csvToJsonAction } from './lib/actions/convert-csv-to-json';
import { jsonToCsvAction } from './lib/actions/convert-json-to-csv';

export const csv = createPiece({
  displayName: 'CSV',
  description: 'Manipulate CSV text',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/csv.svg',
  auth: PieceAuth.None(),
  categories: [BlockCategory.CORE],
  actions: [csvToJsonAction, jsonToCsvAction],
  authors: ["kishanprmr", "MoShizzle", "khaledmashaly", "abuaboud"],
  triggers: [],
});
