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

describe("Todos API", () => {
  it("should create and fetch todos", async () => {
    // Create todo
    const createRes = await request(app)
      .post("/todos")
      .send({ text: "Learn Testing" });
    expect(createRes.statusCode).toBe(200);
    expect(createRes.body.text).toBe("Learn Testing");

    // Fetch todos
    const fetchRes = await request(app).get("/todos");
    expect(fetchRes.statusCode).toBe(200);
    expect(fetchRes.body.length).toBe(1);
    expect(fetchRes.body[0].text).toBe("Learn Testing");
  });
});
