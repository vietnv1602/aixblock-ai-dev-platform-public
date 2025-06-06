import { createCustomApiCallAction } from 'workflow-blocks-common';
import {
    OAuth2PropertyValue,
    PieceAuth,
    createPiece,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { clearSheetAction } from './lib/actions/clear-sheet';
import { copyWorksheetAction } from './lib/actions/copy-worksheet';
import { createColumnAction } from './lib/actions/create-column';
import { createSpreadsheetAction } from './lib/actions/create-spreadsheet';
import { createWorksheetAction } from './lib/actions/create-worksheet';
import { deleteRowAction } from './lib/actions/delete-row.action';
import { findRowByNumAction } from './lib/actions/find-row-by-num';
import { findRowsAction } from './lib/actions/find-rows';
import { findSpreadsheets } from './lib/actions/find-spreadsheets';
import { findWorksheetAction } from './lib/actions/find-worksheet';
import { getRowsAction } from './lib/actions/get-rows';
import { insertMultipleRowsAction } from './lib/actions/insert-multiple-rows.action';
import { insertRowAction } from './lib/actions/insert-row.action';
import { updateMultipleRowsAction } from './lib/actions/update-multiple-rows';
import { updateRowAction } from './lib/actions/update-row';
import { googleSheetsCommon } from './lib/common/common';
import { newOrUpdatedRowTrigger } from './lib/triggers/new-or-updated-row.trigger';
import { newRowAddedTrigger } from './lib/triggers/new-row-added-webhook';
import { newSpreadsheetTrigger } from './lib/triggers/new-spreadsheet';
import { newWorksheetTrigger } from './lib/triggers/new-worksheet';

export const googleSheetsAuth = PieceAuth.OAuth2({
  description: '',

  authUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  required: true,
  scope: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive',
  ],
});

export const googleSheets = createPiece({
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/google-sheets.png',
  categories: [BlockCategory.PRODUCTIVITY],
  authors: [
    'ShayPunter',
    'Ozak93',
    'Abdallah-Alwarawreh',
    'Salem-Alaa',
    'kishanprmr',
    'MoShizzle',
    'AbdulTheActivePiecer',
    'khaledmashaly',
    'abuaboud',
  ],
  actions: [
    insertRowAction,
    insertMultipleRowsAction,
    deleteRowAction,
    updateRowAction,
    findRowsAction,
    createSpreadsheetAction,
    createWorksheetAction,
    clearSheetAction,
    findRowByNumAction,
    getRowsAction,
    findSpreadsheets,
    findWorksheetAction,
    copyWorksheetAction,
    updateMultipleRowsAction,
    createColumnAction,
    createCustomApiCallAction({
      auth: googleSheetsAuth,
      baseUrl: () => {
        return googleSheetsCommon.baseUrl;
      },
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
        };
      },
    }),
  ],
  displayName: 'Google Sheets',
  description: 'Create, edit, and collaborate on spreadsheets online',
  triggers: [newRowAddedTrigger, newOrUpdatedRowTrigger,newSpreadsheetTrigger,newWorksheetTrigger],
  auth: googleSheetsAuth,
});
