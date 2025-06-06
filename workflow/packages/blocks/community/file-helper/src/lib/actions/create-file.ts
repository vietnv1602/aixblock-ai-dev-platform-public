import { createAction, Property } from 'workflow-blocks-framework';
import { encodings } from '../common/encodings';

export const createFile = createAction({
  name: 'createFile',
  displayName: 'Create file',
  description: 'Create file from content',
  props: {
    content: Property.LongText({ displayName: 'Content', required: true }),
    fileName: Property.ShortText({ displayName: 'File name', required: true }),
    encoding: Property.StaticDropdown({
      displayName: 'Encoding',
      required: true,
      defaultValue: 'utf8',
      options: {
        options: encodings,
      },
    }),

  },
  async run({ propsValue, files }) {
    const encoding = propsValue.encoding as BufferEncoding ?? 'utf8';
    const fileUrl = await files.write({
      fileName: propsValue.fileName,
      data: Buffer.from(propsValue.content, encoding),
    });
    return { fileName: propsValue.fileName, url: fileUrl };
  },
});
