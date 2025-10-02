let todos = [];

function getTodos() {
  return todos;
}

function addTodo(text) {
  const todo = { id: Date.now(), text };
  todos.push(todo);
  return todo;
}

function clearTodos() {
  todos = []; // helper for testing
}

module.exports = { getTodos, addTodo, clearTodos };
