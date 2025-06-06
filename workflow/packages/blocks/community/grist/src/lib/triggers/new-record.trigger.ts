import { gristAuth } from '../..';
import { createTrigger, TriggerStrategy } from 'workflow-blocks-framework';
import { commonProps } from '../common/props';
import { GristAPIClient } from '../common/helpers';
import { GristWebhookPayload } from '../common/types';

export const gristNewRecordTrigger = createTrigger({
  auth: gristAuth,
  name: 'grist-new-record',
  displayName: 'New Record',
  description: 'Triggers when a new record is added to the table.',
  props: {
    workspace_id: commonProps.workspace_id,
    document_id: commonProps.document_id,
    table_id: commonProps.table_id,
    readiness_column: commonProps.readiness_column,
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {},
  async onEnable(context) {
    const documentId = context.propsValue.document_id;
    const tableId = context.propsValue.table_id;
    const readinessColumn = context.propsValue.readiness_column;

    const client = new GristAPIClient({
      domainUrl: context.auth.domain,
      apiKey: context.auth.apiKey,
    });

    const response = await client.createDocumentWebhook(documentId, {
      webhooks: [
        {
          fields: {
            url: context.webhookUrl,
            enabled: true,
            eventTypes: ['add'],
            tableId,
            isReadyColumn: readinessColumn,
          },
        },
      ],
    });

    await context.store.put<number>(
      'grist-new-record',
      response.webhooks[0].id
    );
  },
  async onDisable(context) {
    const documentId = context.propsValue.document_id;
    const webhookId = await context.store.get<number>('grist-new-record');

    if (webhookId != null) {
      const client = new GristAPIClient({
        domainUrl: context.auth.domain,
        apiKey: context.auth.apiKey,
      });
      await client.deleteDocumentWebhook(documentId, webhookId);
    }
  },
  async run(context) {
    const payload = context.payload.body as GristWebhookPayload[];
    return payload;
  },
  async test(context) {
    const documentId = context.propsValue.document_id;
    const tableId = context.propsValue.table_id;

    const client = new GristAPIClient({
      domainUrl: context.auth.domain,
      apiKey: context.auth.apiKey,
    });

    const response = await client.listRecordsFromTable(documentId, tableId, {
      limit: '10',
    });

    return response.records.map((record) => {
      return {
        id: record.id,
        ...record.fields,
      };
    });
  },
});
