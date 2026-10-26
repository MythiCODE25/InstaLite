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

async function listPosts({ page = 1, limit = 10, sortBy = "createdAt", order = "desc", location, search, from, to } = {}) {
  const where = {};
  if (location) {
    where.location = { equals: location, mode: "insensitive" };
  }
  if (search) {
    where.caption = { contains: search, mode: "insensitive" };
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lt = to;
  }

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
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
