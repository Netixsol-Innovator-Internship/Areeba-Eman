const todoService = require("../src/services/todoService");

beforeEach(() => {
  todoService.clearTodos();
});

describe("Todo Service", () => {
  it("should add a todo", () => {
    const todo = todoService.addTodo("Learn Jest");
    expect(todo.text).toBe("Learn Jest");
    expect(todoService.getTodos()).toContainEqual(todo);
  });

  it("should return empty todos initially", () => {
    expect(todoService.getTodos()).toEqual([]);
  });
});
