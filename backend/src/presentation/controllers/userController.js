const userService = require('../../business/services/userService');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { username, name, email, password } = req.body;
    const newUser = await userService.registerUser({ username, name, email, password });

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

    const token = jwt.sign(
      { id: user.user_id }, 
      process.env.JWT_SECRET || 'supersecret_change_me', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login success",
      token: token, 
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(404).json({ error: err.message });
  }
}

async function getDashboardData(req, res) {
  try {
    const dashboardData = await userService.getDashboardData(req.user.id);
    res.json(dashboardData);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, getProfile, getDashboardData };