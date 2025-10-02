let todos = [];
let idCounter = 1;

function addTodo(text) {
  const todo = { id: idCounter++, text, completed: false };
  todos.push(todo);
  return todo;
}

function getTodos() {
  return todos;
}

function completeTodo(id) {
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) throw new Error("Todo not found");
  todo.completed = true;
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex((t) => t.id === parseInt(id));
  if (index === -1) throw new Error("Todo not found");
  return todos.splice(index, 1)[0];
}

// 👇 add these test helpers
function clearTodos() {
  todos = [];
  idCounter = 1;
}

function __setTodos(newTodos) {
  todos = newTodos;
  idCounter = newTodos.length ? Math.max(...newTodos.map(t => t.id)) + 1 : 1;
}

module.exports = {
  addTodo,
  getTodos,
  completeTodo,
  deleteTodo,
  clearTodos,
  __setTodos, // 👈 export for tests
};
