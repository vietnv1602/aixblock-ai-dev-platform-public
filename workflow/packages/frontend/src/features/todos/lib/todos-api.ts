import {
  CreateTodoRequestBody,
  ListTodosQueryParams,
  SeekPage,
  Todo,
  TodoWithAssignee,
  UpdateTodoRequestBody,
} from 'workflow-shared';

import { api } from '@/lib/api';

export const todosApi = {
  async get(id: string) {
    return await api.get<TodoWithAssignee>(`/v1/todos/${id}`);
  },
  async list(request: ListTodosQueryParams) {
    return await api.get<SeekPage<TodoWithAssignee>>(`/v1/todos`, request);
  },
  async create(requestBody: CreateTodoRequestBody) {
    return await api.post<Todo>('/v1/todos', requestBody);
  },
  async update(id: string, requestBody: UpdateTodoRequestBody) {
    return await api.post<Todo>(`/v1/todos/${id}`, requestBody);
  },
};
