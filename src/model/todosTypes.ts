import { BaseResponse as BaseTodosResponse } from "./baseTypes";

export interface Todo {
  id: number;
  userId: number;
  todo: string;
  completed: boolean;
}

export interface TodosResponse extends BaseTodosResponse {
  todos: Todo[];
}
