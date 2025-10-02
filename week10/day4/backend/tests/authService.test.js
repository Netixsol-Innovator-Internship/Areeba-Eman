const authService = require("../src/services/authService");

describe("Auth Service", () => {
  it("should return token for valid login", () => {
    const result = authService.login("admin", "1234");
    expect(result.access_token).toBe("fake-jwt-token");
  });

  it("should throw error for invalid login", () => {
    expect(() => authService.login("user", "wrong")).toThrow("Invalid credentials");
  });
});
