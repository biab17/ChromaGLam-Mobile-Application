const { prisma } = require('../../data/prisma/client');
const bcrypt = require('bcryptjs');
const userRepository = require('../../data/repositories/userRepository');

async function registerUser({ username, name, email, password }) {
  const existingEmail = await userRepository.findByEmail(email);
  const existingUsername = await userRepository.findByUsername(username);

  if (existingEmail) throw new Error("Email already used");
  if (existingUsername) throw new Error("Username already taken");

  const hashed = await bcrypt.hash(password, 10);

  return await userRepository.create({
    username,
    name,
    email,
    password: hashed
  });
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect password");

  return user;
}

module.exports = { 
  registerUser,
  loginUser
};
