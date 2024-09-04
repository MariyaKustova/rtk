import React from "react";
import { Checkbox } from "@mui/material";

import { Todo } from "@model/todosTypes";
import { useDeleteTodoMutation, useEditTodoMutation } from "@api/todosApi";
import Controls from "@core/Controls";

import s from "./TodoListItem.module.scss";

interface TodoListItemProps {
  todo: Todo;
  onEdit: (id: number) => void;
}

const TodoListItem = ({ todo, onEdit }: TodoListItemProps) => {
  const [editTodo, { isLoading: isEditLoading }] = useEditTodoMutation();
  const [deleteTodo, { isLoading: isDeleteLoading }] = useDeleteTodoMutation();

  return (
    <div className={s.TodosListItem}>
      <div>
        <Checkbox
          checked={todo.completed}
          onChange={() =>
            editTodo({ ...todo, completed: !todo.completed }).unwrap()
          }
        />
        <span className={todo.completed ? s.TodosListItem__completedTodo : ""}>
          {todo.todo}
        </span>
      </div>
      <Controls
        isDisabled={isEditLoading || isDeleteLoading}
        onEdit={() => onEdit(todo.id)}
        onDelete={() => deleteTodo(todo.id).unwrap()}
      />
    </div>
  );
};

export default TodoListItem;
