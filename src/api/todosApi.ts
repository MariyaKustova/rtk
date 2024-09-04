import { Todo } from "@model/todosTypes";
import { rtkApi } from "./rtkApi";

const BASE_URL = "/todos";

export const todosApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTodos: build.query<Todo[], undefined>({
      query: () => ({
        url: BASE_URL,
      }),
      providesTags: ["Todos"],
    }),
    createTodo: build.mutation<Todo, Omit<Todo, "id">>({
      query: (body) => ({
        url: BASE_URL,
        method: "post",
        body,
      }),
      invalidatesTags: ["Todos"],
    }),
    editTodo: build.mutation<Todo, Todo>({
      query: (todo) => ({
        url: `${BASE_URL}/${todo.id}`,
        method: "put",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: build.mutation<Todo, number>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useEditTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
