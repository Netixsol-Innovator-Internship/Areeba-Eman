// services/authService.js
function login(username, password) {
  if (username === "admin" && password === "1234") {
    return { access_token: "fake-jwt-token" };
  }
  throw new Error("Invalid credentials");
}

module.exports = { login };
