import { api } from '@/lib/api';
import {
  ListOAuth2AppRequest,
  OAuthApp,
  UpsertOAuth2AppRequest,
} from 'workflow-axb-shared';
import { ApEdition, SeekPage } from 'workflow-shared';

export const oauthAppsApi = {
  listCloudOAuthApps(
    edition: ApEdition,
  ): Promise<Record<string, { clientId: string }>> {
    return api.get<Record<string, { clientId: string }>>(
      '/v1/oauth-apps/secret-apps',
      {
        edition,
      },
    );
  },
  listOAuthAppsCredentials(request: ListOAuth2AppRequest) {
    return api.get<SeekPage<OAuthApp>>('/v1/oauth-apps', request);
  },
  delete(credentialId: string) {
    return api.delete<void>(`/v1/oauth-apps/${credentialId}`);
  },
  upsert(request: UpsertOAuth2AppRequest) {
    return api.post<OAuthApp>('/v1/oauth-apps', request);
  },
};
