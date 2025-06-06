import { createAction } from 'workflow-blocks-framework';
import {
    ExecutionType,
    PauseType,
} from 'workflow-shared';
import { createTodoProps, sendTodoApproval } from '../utils/utils';

export const createTodoAndWait = createAction({
  name: 'createTodoAndWait',
  displayName: 'Create Todo and Wait',
  description:
    'Creates a todo for a user and wait for their response or take action.',
  props: createTodoProps,
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  async test(context) {
    if (context.executionType === ExecutionType.BEGIN) {
      context.run.pause({
        pauseMetadata: {
          type: PauseType.WEBHOOK,
          response: {},
        },
      });
      const response = await sendTodoApproval(context, true);
      return response.body;
    } else {
      return {
        status: context.resumePayload.queryParams['status'],
      };
    }
  },
  async run(context) {
    if (context.executionType === ExecutionType.BEGIN) {
      context.run.pause({
        pauseMetadata: {
          type: PauseType.WEBHOOK,
          response: {},
        },
      });
      const response = await sendTodoApproval(context, false);
      return response.body;
    } else {
      return {
        status: context.resumePayload.queryParams['status'],
      };
    }
  },
});