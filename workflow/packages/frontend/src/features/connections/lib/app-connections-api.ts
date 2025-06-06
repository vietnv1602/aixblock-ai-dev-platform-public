import {
  AppConnectionOwners,
  AppConnectionWithoutSensitiveData,
  ListAppConnectionOwnersRequestQuery,
  ListAppConnectionsRequestQuery,
  SeekPage,
  UpdateConnectionValueRequestBody,
  UpsertAppConnectionRequestBody,
} from 'workflow-shared';

import { api } from '@/lib/api';

export const appConnectionsApi = {
  list(
    request: ListAppConnectionsRequestQuery,
  ): Promise<SeekPage<AppConnectionWithoutSensitiveData>> {
    return api.get<SeekPage<AppConnectionWithoutSensitiveData>>(
      '/v1/app-connections',
      request,
    );
  },
  upsert(
    request: UpsertAppConnectionRequestBody,
  ): Promise<AppConnectionWithoutSensitiveData> {
    return api.post<AppConnectionWithoutSensitiveData>(
      '/v1/app-connections',
      request,
    );
  },
  delete(id: string): Promise<void> {
    return api.delete<void>(`/v1/app-connections/${id}`);
  },
  update(
    id: string,
    request: UpdateConnectionValueRequestBody,
  ): Promise<AppConnectionWithoutSensitiveData> {
    return api.post<AppConnectionWithoutSensitiveData>(
      `/v1/app-connections/${id}`,
      request,
    );
  },
  getOwners(
    request: ListAppConnectionOwnersRequestQuery,
  ): Promise<SeekPage<AppConnectionOwners>> {
    return api.get<SeekPage<AppConnectionOwners>>(
      '/v1/app-connections/owners',
      request,
    );
  },
  v2: {
    list(
      request: ListAppConnectionsRequestQuery,
    ): Promise<SeekPage<AppConnectionWithoutSensitiveData>> {
      return api.get<SeekPage<AppConnectionWithoutSensitiveData>>(
        '/v2/app-connections',
        request,
      );
    },
  },
};
