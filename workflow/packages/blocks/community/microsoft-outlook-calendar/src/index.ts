import { createCustomApiCallAction } from 'workflow-blocks-common';
import {
    createPiece,
    OAuth2PropertyValue,
    PieceAuth,
} from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { createEventAction } from './lib/actions/create-event';
import { deleteEventAction } from './lib/actions/delete-event';
import { listEventsAction } from './lib/actions/list-events';
import { outlookCalendarCommon } from './lib/common/common';

export const outlookCalendarAuth = PieceAuth.OAuth2({
  description: 'Authentication for Microsoft Outlook',
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  required: true,
  scope: ['User.Read', 'Calendars.ReadWrite', 'offline_access'],
});

export const microsoftOutlookCalendar = createPiece({
  displayName: "Microsoft Outlook Calendar",
  description: 'Calendar software by Microsoft',
  auth: outlookCalendarAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: "https://cdn.activepieces.com/pieces/microsoft-outlook.png",
  categories: [BlockCategory.PRODUCTIVITY],
  authors: ['antonyvigouret'],
  actions: [
    createEventAction,
    deleteEventAction,
    listEventsAction,
    createCustomApiCallAction({
      auth: outlookCalendarAuth,
      baseUrl() {
        return outlookCalendarCommon.baseUrl;
      },
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
        };
      },
    }),
  ],
  triggers: [],
});
