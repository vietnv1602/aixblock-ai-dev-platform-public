import { HttpMethod, httpClient } from 'workflow-blocks-common';
import { wedofAuth } from '../../..';
import { createAction, Property } from 'workflow-blocks-framework';
import { wedofCommon } from '../../common/wedof';

export const getCertificationFolder = createAction({
  auth: wedofAuth,
  name: 'getCertificationFolder',
  displayName: 'Récupérer un dossier de certification',
  description:
    'Récupérer un dossier de certification à partir de son n° de dossier',
  props: {
    externalId: Property.ShortText({
      displayName: 'N° du dossier de certification',
      description:
        'Sélectionner la propriété {externalId} du dossier de certification',
      required: true,
    }),
  },
  async run(context) {
    return (
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url:
          wedofCommon.baseUrl +
          '/certificationFolders/' +
          context.propsValue.externalId,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});
