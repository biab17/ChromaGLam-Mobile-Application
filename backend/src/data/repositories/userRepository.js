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

async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: {
      preference: true 
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function getDashboardData(userId) {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: { first_name: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const recentlyAdded = await prisma.item.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const ootd = await prisma.item.findFirst({
    where: { userId: userId }
  });

  return {
    userName: user.first_name,
    recentlyAdded,
    ootd
  };
}

module.exports = { 
  create, 
  findByEmail, 
  findByUsername,
  getUserProfile,
  getDashboardData
};
