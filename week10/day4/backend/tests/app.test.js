const request = require("supertest");
const app = require("../src/app");
const todoService = require("../src/services/todoService");

beforeEach(() => {
  todoService.clearTodos();
});

describe("Auth API", () => {
  it("should login successfully", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.access_token).toBe("fake-jwt-token");
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "wrong", password: "pass" });

    expect(res.statusCode).toBe(401);
  });
});


describe("Todo API", () => {
  it("should add a todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ text: "API Todo" });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe("API Todo");
  });

  it("should mark a todo complete", async () => {
    const todo = await request(app).post("/todos").send({ text: "Finish" });
    const res = await request(app).put(`/todos/${todo.body.id}/complete`);
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    const todo = await request(app).post("/todos").send({ text: "Remove" });
    const res = await request(app).delete(`/todos/${todo.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe("Remove");
  });
});

