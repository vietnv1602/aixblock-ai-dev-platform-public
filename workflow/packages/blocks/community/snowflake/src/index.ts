import {
    createPiece,
    PieceAuth,
    Property,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { insertRowAction } from './lib/actions/insert-row';
import { runMultipleQueries } from './lib/actions/run-multiple-queries';
import { runQuery } from './lib/actions/run-query';

export const snowflakeAuth = PieceAuth.CustomAuth({
  props: {
    account: Property.ShortText({
      displayName: 'Account',
      required: true,
      description: 'A string indicating the Snowflake account identifier.',
    }),
    username: Property.ShortText({
      displayName: 'Username',
      required: true,
      description: 'The login name for your Snowflake user.',
    }),
    password: PieceAuth.SecretText({
      displayName: 'Password',
      description: 'Password for the user.',
      required: true,
    }),
    database: Property.ShortText({
      displayName: 'Database',
      description:
        'The default database to use for the session after connecting.',
      required: false,
    }),
    role: Property.ShortText({
      displayName: 'Role',
      description:
        'The default security role to use for the session after connecting.',
      required: false,
    }),
    warehouse: Property.ShortText({
      displayName: 'Warehouse',
      description:
        'The default virtual warehouse to use for the session after connecting. Used for performing queries, loading data, etc.',
      required: false,
    }),
  },
  required: true,
});
export const snowflake = createPiece({
  displayName: 'Snowflake',
  description: 'Data warehouse built for the cloud',

  auth: snowflakeAuth,
  minimumSupportedRelease: '0.27.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/snowflake.png',
  categories: [BlockCategory.DEVELOPER_TOOLS],
  authors: ['AdamSelene', 'abuaboud', 'valentin-mourtialon'],
  actions: [runQuery, runMultipleQueries, insertRowAction],
  triggers: [],
});
