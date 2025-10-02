const express = require("express");
const { getTodos, addTodo, completeTodo, deleteTodo } = require("../controllers/todoController");

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id/complete", completeTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
