import { httpClient, HttpMethod } from 'workflow-blocks-common';
import { createAction, DynamicPropsValue, Property, StoreScope } from 'workflow-blocks-framework';
import { isNil } from 'workflow-shared';
import { callableFlowKey, CallableFlowResponse, MOCK_CALLBACK_IN_TEST_FLOW_URL } from '../common';

export const response = createAction({
  name: 'returnResponse',
  displayName: 'Return Response',
  description: 'Return response to the original flow',
  props: {
    mode: Property.StaticDropdown({
      displayName: 'Mode',
      description: 'Choose Simple for key-value or Advanced for JSON.',
      required: true,
      defaultValue: 'simple',
      options: {
        disabled: false,
        options: [
          {
            label: 'Simple',
            value: 'simple',
          },
          {

            label: 'Advanced',
            value: 'advanced',
          },
        ],
      },
    }),
    response: Property.DynamicProperties({
      displayName: 'Response',
      required: true,
      refreshers: ['mode'],
      props: async (propsValue) => {
        const mode = propsValue['mode'] as unknown as string;
        const fields: DynamicPropsValue = {};
        if (mode === 'simple') {
          fields['response'] = Property.Object({
            displayName: 'Response',
            required: true,
          });
        } else {
          fields['response'] = Property.Json({
            displayName: 'Response',
            required: true,
          });
        }
        return fields;
      },
    }),
  },
  async test(context) {
    return context.propsValue.response['response'];
  },
  async run(context) {
    const response = context.propsValue.response['response'];
    const callbackUrl = await context.store.get<string>(callableFlowKey(context.run.id), StoreScope.FLOW);
    if (isNil(callbackUrl)) {
      throw new Error(JSON.stringify({
        message: "Please ensure the first action in the flow is Callable Flow"
      }));
    }
    const isNotTestFlow = callbackUrl !== MOCK_CALLBACK_IN_TEST_FLOW_URL;
    if (isNotTestFlow) {
      await httpClient.sendRequest<CallableFlowResponse>({
        method: HttpMethod.POST,
        url: callbackUrl,
        body: {
          data: response
        },
        retries: 4,
      });
    }
    return response;
  },
});
