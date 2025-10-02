const todoService = require("../services/todoService");

function getTodos(req, res) {
  res.json(todoService.getTodos());
}

function addTodo(req, res) {
  const { text } = req.body;
  const newTodo = todoService.addTodo(text);
  res.json(newTodo);
}

module.exports = { getTodos, addTodo };
