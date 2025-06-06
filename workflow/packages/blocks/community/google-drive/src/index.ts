import {
    OAuth2PropertyValue,
    PieceAuth,
    createPiece,
} from 'workflow-blocks-framework';

import { createCustomApiCallAction } from 'workflow-blocks-common';
import { BlockCategory } from 'workflow-shared';
import { addPermission } from './lib/action/add-permission.action';
import { googleDriveCreateNewFolder } from './lib/action/create-new-folder';
import { googleDriveCreateNewTextFile } from './lib/action/create-new-text-file';
import { googleDriveDeleteFile } from './lib/action/delete-file';
import { deletePermission } from './lib/action/delete-permission.action';
import { duplicateFileAction } from './lib/action/duplicate-file.action';
import { googleDriveGetResourceById } from './lib/action/get-file-by-id';
import { googleDriveListFiles } from './lib/action/list-files.action';
import { moveFileAction } from './lib/action/move-file';
import { readFile } from './lib/action/read-file';
import { saveFileAsPdf } from './lib/action/save-file-as-pdf.action';
import { googleDriveSearchFolder } from './lib/action/search-folder-or-file.action';
import { googleDriveTrashFile } from './lib/action/send-to-trash';
import { setPublicAccess } from './lib/action/set-public-access';
import { googleDriveUploadFile } from './lib/action/upload-file';
import { newFile } from './lib/triggers/new-file';
import { newFolder } from './lib/triggers/new-folder';

export const googleDriveAuth = PieceAuth.OAuth2({
  description: '',
  authUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  required: true,
  scope: ['https://www.googleapis.com/auth/drive'],
});

export const googleDrive = createPiece({
  minimumSupportedRelease: '0.5.6',
  logoUrl: 'https://cdn.activepieces.com/pieces/google-drive.png',
  categories: [BlockCategory.CONTENT_AND_FILES],
  displayName: 'Google Drive',
  description: 'Cloud storage and file backup',
  authors: [
    'BastienMe',
    'ArmanGiau3',
    'Vitalini',
    'pfernandez98',
    'kanarelo',
    'Salem-Alaa',
    'kishanprmr',
    'MoShizzle',
    'AbdulTheActivePiecer',
    'khaledmashaly',
    'abuaboud',
  ],
  triggers: [newFile, newFolder],
  actions: [
    googleDriveCreateNewFolder,
    googleDriveCreateNewTextFile,
    googleDriveUploadFile,
    readFile,
    googleDriveGetResourceById,
    googleDriveListFiles,
    googleDriveSearchFolder,
    duplicateFileAction,
    saveFileAsPdf,
    addPermission,
    deletePermission,
    setPublicAccess,
    moveFileAction,
    googleDriveDeleteFile,
    googleDriveTrashFile,
    createCustomApiCallAction({
      baseUrl: () => 'https://www.googleapis.com/drive/v3',
      auth: googleDriveAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
      }),
    }),
  ],
  auth: googleDriveAuth,
});
