import { createAction, Property } from 'workflow-blocks-framework';
import { assertNotNullOrUndefined } from 'workflow-shared';
import { figmaAuth } from '../../';
import { figmaCommon } from '../common';
import { figmaGetRequest } from '../common/utils';

export const getFileAction = createAction({
  auth: figmaAuth,
  name: 'get_file',
  displayName: 'Get File',
  description: 'Get file',
  props: {
    file_key: Property.ShortText({
      displayName: 'File Key',
      description: 'The Figma file key (copy from Figma file URL)',
      required: true,
    }),
  },
  async run(context) {
    const token = context.auth.access_token;
    const fileKey = context.propsValue.file_key;

    assertNotNullOrUndefined(token, 'token');
    assertNotNullOrUndefined(fileKey, 'file_key');

    const url = `${figmaCommon.baseUrl}/${figmaCommon.files}`.replace(
      ':file_key',
      fileKey
    );

    return figmaGetRequest({ token, url });
  },
});
