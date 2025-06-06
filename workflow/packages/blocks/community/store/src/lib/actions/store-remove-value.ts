import {
  createAction,
  Property,
  StoreScope,
} from 'workflow-blocks-framework';
import { common, getScopeAndKey } from './common';
import { z } from 'zod';
import { propsValidation } from 'workflow-blocks-common';

export const storageRemoveValue = createAction({
  name: 'remove_value',
  displayName: 'Remove',
  description: 'Remove a value from storage',
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  props: {
    key: Property.ShortText({
      displayName: 'Key',
      required: true,
    }),
    store_scope: common.store_scope,
  },
  async run(context) {
    await propsValidation.validateZod(context.propsValue, {
      key: z.string().max(128),
    });

    const { key, scope } = getScopeAndKey({
      runId: context.run.id,
      key: context.propsValue['key'],
      scope: context.propsValue.store_scope,
    });
    await context.store.delete(key, scope);
    return {
      success: true,
    };
  },
});
