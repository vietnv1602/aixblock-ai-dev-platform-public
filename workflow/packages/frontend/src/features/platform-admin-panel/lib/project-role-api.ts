import { api } from '@/lib/api';
import { ProjectMemberWithUser } from 'workflow-axb-shared';
import {
    CreateProjectRoleRequestBody,
    ListProjectMembersForProjectRoleRequestQuery,
    ProjectRole,
    SeekPage,
    UpdateProjectRoleRequestBody,
} from 'workflow-shared';

export const projectRoleApi = {
  async get(id: string) {
    return await api.get<ProjectRole>(`/v1/project-roles/${id}`);
  },
  async list() {
    return await api.get<SeekPage<ProjectRole>>(`/v1/project-roles`);
  },
  async create(requestBody: CreateProjectRoleRequestBody) {
    return await api.post<ProjectRole>('/v1/project-roles', requestBody);
  },
  async update(id: string, requestBody: UpdateProjectRoleRequestBody) {
    return await api.post<ProjectRole>(`/v1/project-roles/${id}`, requestBody);
  },
  async delete(id: string) {
    return await api.delete<void>(`/v1/project-roles/${id}`);
  },
  async listProjectMembers(
    id: string,
    requestQuery: ListProjectMembersForProjectRoleRequestQuery,
  ) {
    return await api.get<SeekPage<ProjectMemberWithUser>>(
      `/v1/project-roles/${id}/project-members`,
      requestQuery,
    );
  },
};
