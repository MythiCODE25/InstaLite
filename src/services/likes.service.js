const prisma = require("../db");

async function getLikesByPostId(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  return await prisma.user.findMany({
    where: {
      likes: {
        some: { postId },
      },
    },
    select: {
      id: true,
      username: true,
      fullname: true,
    },
    orderBy: {
      username: "asc",
    },
  });
}

async function likePost(postId, userId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  try {
    return await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("Already liked");
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

async function unlikePost(postId, userId) {
  try {
    return await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Like not found");
      err.status = 404;
      throw err;
    }
    throw error;
  }
}

module.exports = {
  getLikesByPostId,
  likePost,
  unlikePost,
};
