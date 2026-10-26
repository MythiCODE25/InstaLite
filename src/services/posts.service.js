const prisma = require("../db");

async function createPost(data) {
  const author = await prisma.user.findUnique({
    where: { id: data.authorId },
  });
  if (!author) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const postData = {
    imageUrl: data.imageUrl,
    authorId: data.authorId,
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

  let orderBy;
  if (sortBy === "likes") {
    orderBy = [
      { likes: { _count: order } },
      { createdAt: "desc" },
    ];
  } else {
    orderBy = { [sortBy]: order };
  }

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
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
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
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
