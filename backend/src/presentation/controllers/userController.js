const userService = require('../../business/services/userService');

async function register(req, res) {
  try {
    const { username, name, email, password } = req.body;

    const newUser = await userService.registerUser({
      username,
      name,
      email,
      password
    });

    res.status(201).json({
      user_id: newUser.user_id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

    res.status(200).json({
      message: "Login success",
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { register, login };
