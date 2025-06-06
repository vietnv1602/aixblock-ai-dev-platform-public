import { createAction, Property } from 'workflow-blocks-framework';
import { assertNotNullOrUndefined } from 'workflow-shared';
import { todoistAuth } from '../..';
import { todoistRestClient } from '../common/client/rest-client';

export const todoistUpdateTaskAction = createAction({
  auth: todoistAuth,
  name: 'update_task',
  displayName: 'Update Task',
  description: 'Updates an existing task.',
  props: {
    task_id: Property.ShortText({
      displayName: 'Task ID',
      required: true,
    }),
    content: Property.LongText({
      displayName: 'content',
      description:
        "The task's content. It may contain some markdown-formatted text and hyperlinks",
      required: false,
    }),
    description: Property.LongText({
      displayName: 'Description',
      description:
        'A description for the task. This value may contain some markdown-formatted text and hyperlinks.',
      required: false,
    }),
    labels: Property.Array({
      displayName: 'Labels',
      required: false,
      description:
        "The task's labels (a list of names that may represent either personal or shared labels)",
    }),
    priority: Property.Number({
      displayName: 'Priority',
      description: 'Task priority from 1 (normal) to 4 (urgent)',
      required: false,
    }),
    due_date: Property.ShortText({
      displayName: 'Due date',
      description:
        "Can be either a specific date in YYYY-MM-DD format relative to user's timezone, a specific date and time in RFC3339 format, or a human defined date (e.g. 'next Monday') using local time",
      required: false,
    }),
  },

  async run({ auth, propsValue }) {
    const token = auth.access_token;
    const { task_id, content, description, priority, due_date } = propsValue;
    const labels = propsValue.labels as string[];

    assertNotNullOrUndefined(token, 'token');
    return await todoistRestClient.tasks.update({
      token,
      task_id,
      content,
      description,
      labels,
      priority,
      due_date,
    });
  },
});
