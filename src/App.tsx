/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

import { Header } from './components/Header/Header';
import { Filter } from './components/Filter/Filter';
import { Error } from './components/Error/Error';
import { TodoList } from './components/ToDoList/ToDoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);


  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const temp = {
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const createdTodo = await addTodo(title.trim());
      setTodos(current => [...current, createdTodo]);
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setTempTodo(null);
    }
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const incompleteTodosCount = todos.filter(todo => !todo.completed).length;

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingIds(current => current.filter(id => id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          onAddTodo={handleAddTodo}
        />

        <TodoList
          todos={visibleTodos}
          loading={loading}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {incompleteTodosCount} items left
            </span>

            <Filter filter={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Error error={error} onClose={() => setError('')} />
    </div>
  );
};
