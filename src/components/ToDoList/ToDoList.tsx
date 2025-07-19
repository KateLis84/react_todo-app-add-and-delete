import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../ToDoItem/ToDoItem';

type Props = {
  todos: Todo[];
  loading: boolean;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  tempTodo,
  onDelete
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {loading && (
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    )}

    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
    ))}

    {tempTodo && (
      <TodoItem key="temp" todo={tempTodo} onDelete={onDelete} />
    )}
  </section>
);
