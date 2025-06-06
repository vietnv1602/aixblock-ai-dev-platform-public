import { HttpMethod, httpClient } from 'workflow-blocks-common';
import { googleDriveAuth } from '../../index';
import { Property, createAction } from "workflow-blocks-framework";
import querystring from 'querystring';
import { common } from '../common';

export const googleDriveListFiles = createAction({
  auth: googleDriveAuth,
  name: 'list-files',
  displayName: 'List files',
  description: 'List files from a Google Drive folder',
  props: {
    folderId: Property.ShortText({
      displayName: 'Folder ID',
      description: 'Folder ID coming from | New Folder -> id | (or any other source)',
      required: true,
    }),
        include_team_drives: common.properties.include_team_drives,
    
    includeTrashed: Property.Checkbox({
      displayName: 'Include Trashed',
      description: 'Include new files that have been trashed.',
      required: false,
      defaultValue: false
    }),
  },
  async run(context) {
    const result = {
      'type': 'drive#fileList',
      'incompleteSearch': false,
      'files': [] as unknown[],
    }

    let q = `'${context.propsValue.folderId}' in parents`;

    // When include_trashed is false, we add a filter to exclude trashed files.
    // By default, Google Drive API returns trashed files as well.
    if (!context.propsValue.includeTrashed) {
      q += ' and trashed=false';
    }

    const params: Record<string, string> = {
      q: q,
      fields: 'files(id,kind,mimeType,name,trashed)',
      supportsAllDrives:'true',
      includeItemsFromAllDrives: context.propsValue.include_team_drives?'true':'false',
    }

    let response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://www.googleapis.com/drive/v3/files?${querystring.stringify(params)}`,
      headers: {
        Authorization: `Bearer ${context.auth.access_token}`,
      },
    });

    result.files = [...response.body.files];
    while(response.body.nextPageToken)
    {
      params.pageToken = response.body.nextPageToken;
      response = await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `https://www.googleapis.com/drive/v3/files?${querystring.stringify(params)}`,
        headers: {
          Authorization: `Bearer ${context.auth.access_token}`,
        },
      });
      result.files.push(...response.body.files);
      result.incompleteSearch = result.incompleteSearch || response.body.incompleteSearch;
    }
    return result;
  }
});
