const prisma = require("../db");

async function createUser(data) {
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      fullname: data.fullname,
      bio: data.bio !== undefined ? data.bio : null,
    },
  });
}

async function listUsers() {
  return await prisma.user.findMany();
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
