const todoService = require("../src/services/todoService");

describe("Todo Service", () => {
  beforeEach(() => {
    // reset in-memory todos before each test
    todoService.__setTodos([]);
  });

  it("should add a todo", () => {
    const todo = todoService.addTodo("Test Todo");
    expect(todo.text).toBe("Test Todo");
    expect(todo.completed).toBe(false);
  });

  it("should return all todos", () => {
    todoService.addTodo("Task 1");
    todoService.addTodo("Task 2");
    const todos = todoService.getTodos();
    expect(todos.length).toBe(2);
  });

  it("should mark todo as complete", () => {
    const todo = todoService.addTodo("Complete me");
    const updated = todoService.completeTodo(todo.id);
    expect(updated.completed).toBe(true);
  });

  it("should delete a todo", () => {
    const todo = todoService.addTodo("Delete me");
    const removed = todoService.deleteTodo(todo.id);
    expect(removed.text).toBe("Delete me");

    const todos = todoService.getTodos();
    expect(todos.length).toBe(0);
  });

  it("should throw error if completing non-existing todo", () => {
    expect(() => todoService.completeTodo(999)).toThrow("Todo not found");
  });

  it("should throw error if deleting non-existing todo", () => {
    expect(() => todoService.deleteTodo(999)).toThrow("Todo not found");
  });
});
