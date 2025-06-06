import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from 'workflow-blocks-common';
import { createAction, Property } from 'workflow-blocks-framework';
import { dustAuth } from '../..';
import { DUST_BASE_URL } from '../common';

export const upsertDocument = createAction({
  name: 'addDocument',
  displayName: 'Add or update document',
  description:
    'Insert a new document to a Data Source (or update an existing one)',
  auth: dustAuth,
  props: {
    datasource: Property.ShortText({
      displayName: 'Data Source name',
      required: true,
    }),
    documentId: Property.ShortText({
      displayName: 'Document ID',
      description: 'The ID of the document you want to insert or replace',
      required: true,
    }),
    content: Property.LongText({
      displayName: 'Document content',
      description: 'The text content of the document',
      required: true,
    }),
    sourceUrl: Property.ShortText({
      displayName: 'Source URL',
      description: 'The source URL of the document (when cited)',
      required: false,
    }),
    title: Property.ShortText({
      displayName: 'Document title',
      description: 'User-friendly title of the document',
      required: false,
    }),
    tags: Property.Array({
      displayName: 'Tags',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const tags = propsValue.title
      ? [`title:${propsValue.title}`, ...(propsValue.tags as string[])]
      : (propsValue.tags as string[]);
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${DUST_BASE_URL}/${auth.workspaceId}/data_sources/${
        propsValue.datasource
      }/documents/${encodeURIComponent(propsValue.documentId)}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.apiKey}`,
      },
      body: JSON.stringify(
        {
          text: propsValue.content,
          source_url: propsValue.sourceUrl,
          tags: tags,
        },
        (key, value) => (typeof value === 'undefined' ? null : value)
      ),
    };

    const response = await httpClient.sendRequest(request);
    return response.body;
  },
});
