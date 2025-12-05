const { prisma } = require('../prisma/client');

async function create(data) {
  return prisma.user.create({ data });
}

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

async function findByUsername(username) {
  return prisma.user.findUnique({
    where: { username }
  });
}

module.exports = { create, findByEmail, findByUsername };
