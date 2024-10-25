import { UpdateDomainTaskModelType } from "../model/tasks.reducer";
import { BaseResponse } from "common/types";
import { TaskPriorities, TaskStatuses } from "common/enums";
import { instance } from "common/instance";

// api
export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>("todo-lists");
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<BaseResponse<{ item: TodolistType }>>("todo-lists", { title: title });
    return promise;
  },
  deleteTodolist(todolistsId: string) {
    const promise = instance.delete<BaseResponse>(`todo-lists/${todolistsId}`);
    return promise;
  },
  updateTodolist(arg: UpdateTodolistType) {
    const { todolistId, title } = arg;
    return instance.put<BaseResponse>(`todo-lists/${todolistId}`, { title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: RemoveTaskArg) {
    const { todolistId, taskId } = arg;
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(arg: AddTaskArgs) {
    const { todolistId, title } = arg;
    return instance.post<BaseResponse<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponse<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type UpdateTaskArgs = {
  taskId: string;
  model: UpdateDomainTaskModelType;
  todolistId: string;
};

export type UpdateTodolistType = AddTaskArgs;

export type AddTaskArgs = {
  todolistId: string;
  title: string;
};

export type RemoveTaskArg = {
  todolistId: string;
  taskId: string;
};

// types
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
