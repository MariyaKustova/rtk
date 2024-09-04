import React, { useState } from "react";
import toast from "react-hot-toast";

import { Loader } from "@core/Loader";
import PageTitle from "@core/PageTitle";
import {
  useCreateTodoMutation,
  useEditTodoMutation,
  useGetTodosQuery,
} from "@api/todosApi";
import { getRandomInt } from "../../utils";
import TodosList from "./components/TodosList";
import { TodoDialog } from "./components/TodoDialog";

const TodosPage = () => {
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: todos = [],
    error,
    isLoading: isTodosLoading,
  } = useGetTodosQuery(undefined);

  if (error) {
    toast.error("Error todos loading...");
  }

  const todosUserIds = todos.map(({ userId }) => userId);
  const currentTodo = todos.find((todo) => todo.id === editTodoId);

  const [createTodo] = useCreateTodoMutation();
  const [editTodo] = useEditTodoMutation();

  const onCloseEditDialog = () => setEditTodoId(null);

  const addTodo = (value: string) => {
    const userId = todosUserIds?.[getRandomInt(todosUserIds.length - 1)];

    if (value.length && todosUserIds?.length && userId) {
      createTodo({
        userId,
        todo: value,
        completed: false,
      });
    }
    onCloseEditDialog();
  };

  const editContentTodo = (value: string) => {
    if (currentTodo && value.length && currentTodo.todo !== value) {
      editTodo({ ...currentTodo, todo: value });
    }

    onCloseEditDialog();
  };

  return (
    <>
      <PageTitle title="Todos" onClick={() => setOpenDialog(true)} />
      {isTodosLoading ? (
        <Loader />
      ) : (
        <>
          {todos && <TodosList todos={todos} onEdit={setEditTodoId} />}
          {Boolean(editTodoId) && (
            <TodoDialog
              open={Boolean(editTodoId)}
              onClose={onCloseEditDialog}
              value={currentTodo?.todo}
              onChange={editContentTodo}
              isEdit
            />
          )}
          {openDialog && (
            <TodoDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onChange={addTodo}
            />
          )}
        </>
      )}
    </>
  );
};

export default TodosPage;
