import { HttpMethod, httpClient } from 'workflow-blocks-common';
import { createAction } from 'workflow-blocks-framework';
import { vtigerAuth } from '../..';
import { instanceLogin, recordProperty } from '../common';
import { elementTypeProperty } from '../common';

//Docs: https://code.vtiger.com/vtiger/vtigercrm-manual/-/wikis/Webservice-Docs
//Extra: https://help.vtiger.com/article/147111249-Rest-API-Manual

export const createRecord = createAction({
  name: 'create_record',
  auth: vtigerAuth,
  displayName: 'Create Record',
  description: 'Create a Record',
  props: {
    elementType: elementTypeProperty,
    record: recordProperty(),
  },
  async run({ propsValue: { elementType, record }, auth }) {
    const instance = await instanceLogin(
      auth.instance_url,
      auth.username,
      auth.password
    );

    if (instance !== null) {
      const response = await httpClient.sendRequest<Record<string, unknown>[]>({
        method: HttpMethod.POST,
        url: `${auth.instance_url}/webservice.php`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          operation: 'create',
          sessionName: instance.sessionId ?? instance.sessionName,
          elementType: elementType,
          element: JSON.stringify(record),
        },
      });

      console.debug({
        operation: 'create',
        sessionName: instance.sessionId ?? instance.sessionName,
        elementType: elementType,
        element: JSON.stringify(record),
      });

      return response.body;
    }

    return null;
  },
});
