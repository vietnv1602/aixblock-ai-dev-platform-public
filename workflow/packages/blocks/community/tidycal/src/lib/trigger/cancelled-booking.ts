import { createTrigger, TriggerStrategy } from 'workflow-blocks-framework';
import {
  DedupeStrategy,
  HttpMethod,
  Polling,
  pollingHelper,
} from 'workflow-blocks-common';
import { calltidycalapi } from '../common';
import { tidyCalAuth } from '../../';
import dayjs from 'dayjs';

export const tidycalbookingcancelled = createTrigger({
  auth: tidyCalAuth,
  name: 'booking_canceled',
  displayName: 'Booking Canceled',
  description: 'Triggers when a new booking is canceled',
  props: {},
  sampleData: {
    data: [
      {
        id: 1,
        contact_id: 1,
        booking_type_id: 1,
        starts_at: '2022-01-01T00:00:00.000000Z',
        ends_at: '2022-02-01T00:00:00.000000Z',
        cancelled_at: '2022-02-01T00:00:00.000000Z',
        created_at: '2022-02-01T00:00:00.000000Z',
        updated_at: '2022-02-01T00:00:00.000000Z',
        timezone: 'America/Los_Angeles',
        meeting_url: 'https://zoom.us/j/949494949494',
        meeting_id: 'fw44lkj48fks',
        questions: {},
        contact: {
          id: '1',
          email: 'john@doe.com',
          name: 'John Doe',
          created_at: '2022-01-01T00:00:00.000000Z',
          updated_at: '2022-01-01T00:00:00.000000Z',
        },
      },
    ],
  },
  type: TriggerStrategy.POLLING,
  onEnable: async (context) => {
    await pollingHelper.onEnable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },
  onDisable: async (context) => {
    await pollingHelper.onDisable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    });
  },
  run: async (context) => {
    return await pollingHelper.poll(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
      files: context.files,
    });
  },
  test: async (context) => {
    return await pollingHelper.test(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
      files: context.files,
    });
  },
});

const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, lastFetchEpochMS }) => {
    const currentValues = await calltidycalapi<{
      data: {
        id: string;
        cancelled_at: string;
      }[];
    }>(HttpMethod.GET, `bookings?cancelled=true`, auth, undefined);

    const cancelledBookings = currentValues.body;
    const bookings = cancelledBookings.data.filter((item) => {
      const cancelledAt = dayjs(item.cancelled_at);
      return cancelledAt.isAfter(lastFetchEpochMS);
    });
    return bookings.map((item) => {
      return {
        epochMilliSeconds: dayjs(item.cancelled_at).valueOf(),
        data: item,
      };
    });
  },
};
