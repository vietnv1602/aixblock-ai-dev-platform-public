import { createAction, Property } from 'workflow-blocks-framework';
import { zooAuth } from '../../../index'
import { httpClient, HttpMethod } from 'workflow-blocks-common';

export const convertTemperatureAction = createAction({
  name: 'convert_temperature',
  displayName: 'Convert Temperature',
  description: 'Convert temperature measurements between different units',
  auth: zooAuth,
  // category: 'Unit Conversion',
  props: {
    value: Property.Number({
      displayName: 'Value',
      required: true,
      description: 'The temperature value to convert',
    }),
    inputUnit: Property.StaticDropdown({
      displayName: 'Input Unit',
      required: true,
      options: {
        options: [
          { label: 'Celsius', value: 'C' },
          { label: 'Fahrenheit', value: 'F' },
          { label: 'Kelvin', value: 'K' },
        ],
      },
    }),
    outputUnit: Property.StaticDropdown({
      displayName: 'Output Unit',
      required: true,
      options: {
        options: [
          { label: 'Celsius', value: 'C' },
          { label: 'Fahrenheit', value: 'F' },
          { label: 'Kelvin', value: 'K' },
        ],
      },
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.zoo.dev/unit/conversion/temperature/${propsValue.inputUnit}/${propsValue.outputUnit}`,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      queryParams: {
        value: propsValue.value.toString(),
      },
    });
    return response.body;
  },
});
