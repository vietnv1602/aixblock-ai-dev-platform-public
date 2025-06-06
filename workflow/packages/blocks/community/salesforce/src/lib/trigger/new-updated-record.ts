import {
  DedupeStrategy,
  HttpMethod,
  Polling,
  pollingHelper,
} from 'workflow-blocks-common';
import {
  OAuth2PropertyValue,
  Property,
  TriggerStrategy,
  createTrigger,
} from 'workflow-blocks-framework';
import { querySalesforceApi, salesforcesCommon } from '../common';

import dayjs from 'dayjs';
import { salesforceAuth } from '../..';

export const newOrUpdatedRecord = createTrigger({
  auth: salesforceAuth,
  name: 'new_or_updated_record',
  displayName: 'New or Updated Record',
  description: 'Triggers when there is new or updated record',
  props: {
    object: salesforcesCommon.object,
    conditions: Property.LongText({
      displayName: 'Conditions (Advanced)',
      description: 'Enter a SOQL query where clause i. e. IsDeleted = TRUE',
      required: false,
    }),
  },
  sampleData: {},
  type: TriggerStrategy.POLLING,
  async test(ctx) {
    return await pollingHelper.test(polling, {
      auth: ctx.auth,
      store: ctx.store,
      propsValue: ctx.propsValue,
      files: ctx.files,
    });
  },
  async onEnable(ctx) {
    await pollingHelper.onEnable(polling, {
      auth: ctx.auth,
      store: ctx.store,
      propsValue: ctx.propsValue,
    });
  },
  async onDisable(ctx) {
    await pollingHelper.onDisable(polling, {
      auth: ctx.auth,
      store: ctx.store,
      propsValue: ctx.propsValue,
    });
  },
  async run(ctx) {
    return await pollingHelper.poll(polling, ctx);
  },
});

const polling: Polling<
  OAuth2PropertyValue,
  { object: string | undefined; conditions: string | undefined }
> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue, lastFetchEpochMS }) => {
    const items = await getRecords(
      auth,
      propsValue.object!,
      dayjs(lastFetchEpochMS).toISOString(),
      propsValue.conditions
    );
    return items.map((item) => ({
      epochMilliSeconds: dayjs(item.LastModifiedDate).valueOf(),
      data: item,
    }));
  },
};

const getRecords = async (
  authentication: OAuth2PropertyValue,
  object: string,
  startDate: string,
  conditions: string | undefined
) => {
  const response = await querySalesforceApi<{
    records: { LastModifiedDate: string }[];
  }>(
    HttpMethod.GET,
    authentication,
    constructQuery(object, 200, 0, startDate, conditions)
  );
  return response.body['records'];
};

function constructQuery(
  object: string,
  limit: number,
  offset: number,
  startDate: string,
  conditions: string | undefined
) {
  return `
    SELECT
      FIELDS(ALL)
    FROM
      ${object}
    WHERE LastModifiedDate > ${startDate} ${
    conditions != undefined ? `AND ${conditions}` : ''
  }
    ORDER BY LastModifiedDate ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}
