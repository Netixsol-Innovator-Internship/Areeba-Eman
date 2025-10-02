// controllers/authController.js
const authService = require("../services/authService");

function login(req, res) {
  try {
    const { username, password } = req.body;
    const result = authService.login(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = { login };
