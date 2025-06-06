import {
  createPiece,
  PieceAuth,
  Property,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { getAccounts } from './lib/actions/get-accounts';
import { getBudget } from './lib/actions/get-budget';
import { getCategories } from './lib/actions/get-categories';
import { importTransaction } from './lib/actions/import-transaction';
import { importTransactions } from './lib/actions/import-transactions';

export const actualBudgetAuth = PieceAuth.CustomAuth({
  description: 'Enter authentication details',
  props: {
    server_url: Property.ShortText({
      displayName: 'Server URL',
      description: 'This is the URL of your running server',
      required: true,
    }),
    password: PieceAuth.SecretText({
      displayName: 'Password',
      description: 'This is the password you use to log into the server',
      required: true,
    }),
    sync_id: PieceAuth.SecretText({
      displayName: 'Sync ID',
      description:
        'This is the ID from Settings → Show advanced settings → Sync ID',
      required: true,
    }),
    encryption_password: PieceAuth.SecretText({
      displayName: 'End-to-end encryption password',
      description: 'if you have end-to-end encryption enabled',
      required: false,
    }),
  },
  required: true,
});

export const actualbudget = createPiece({
  displayName: 'Actual Budget',
  description: 'Personal finance app',
  auth: actualBudgetAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/actualbudget.png',
  categories: [BlockCategory.ACCOUNTING],
  authors: ['hugh-codes'],

  actions: [
    getBudget,
    importTransaction,
    importTransactions,
    getCategories,
    getAccounts,
  ],
  triggers: [],
});
