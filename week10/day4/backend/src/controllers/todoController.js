const todoService = require("../services/todoService");

function getTodos(req, res) {
  res.json(todoService.getTodos());
}

function addTodo(req, res) {
  const { text } = req.body;
  const todo = todoService.addTodo(text);
  res.status(201).json(todo);
}

function completeTodo(req, res) {
  try {
    const id = parseInt(req.params.id);
    const todo = todoService.completeTodo(id);
    res.json(todo);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

function deleteTodo(req, res) {
  try {
    const id = parseInt(req.params.id);
    const todo = todoService.deleteTodo(id);
    res.json(todo);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

module.exports = { getTodos, addTodo, completeTodo, deleteTodo };
