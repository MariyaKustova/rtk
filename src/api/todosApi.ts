import { Todo, TodosResponse } from "@model/todosTypes";
import { rtkApi } from "./rtkApi";

const BASE_URL = "/todos";

export const todosApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTodos: build.query<Todo[], undefined>({
      query: () => ({
        url: BASE_URL,
      }),
      transformResponse: (response: TodosResponse) => response.todos,
    }),
    createTodo: build.mutation<Todo, Omit<Todo, "id">>({
      query: (body) => ({
        url: `${BASE_URL}/add`,
        method: "post",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: createdTodo } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData(
              "getTodos",
              undefined,
              (todos: Todo[]) => {
                todos.push(createdTodo);
              }
            )
          );
        } catch {}
      },
    }),
    editTodo: build.mutation<Todo, { id: number; completed: boolean }>({
      query: ({ completed, id }) => ({
        url: `${BASE_URL}/${id}`,
        method: "put",
        body: { completed },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: editTodo } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData(
              "getTodos",
              undefined,
              (todos: Todo[]) =>
                todos.map((todo) => {
                  if (todo.id === editTodo.id) {
                    return editTodo;
                  }
                  return todo;
                })
            )
          );
        } catch {}
      },
    }),
    deleteTodo: build.mutation<Todo, number>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "delete",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data: deleteTodo } = await queryFulfilled;
          dispatch(
            todosApi.util.updateQueryData(
              "getTodos",
              undefined,
              (todos: Todo[]) =>
                todos.filter((todo) => todo.id !== deleteTodo.id)
            )
          );
        } catch {}
      },
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
