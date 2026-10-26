const prisma = require("../db");

async function createPost(data) {
  const postData = {
    imageUrl: data.imageUrl,
  };
  if (data.caption !== undefined) postData.caption = data.caption;
  if (data.location !== undefined) postData.location = data.location;

  return await prisma.post.create({
    data: postData,
  });
}

async function listPosts() {
  return await prisma.post.findMany();
}

async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id },
  });
}

async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id },
    data,
  });
}

async function deletePost(id) {
  return await prisma.post.delete({
    where: { id },
  });
}

module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
};
