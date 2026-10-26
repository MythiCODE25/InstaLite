const prisma = require("../src/db");
const { users, posts, likes } = require("./seed-data");

async function main() {
  // 1. Delete all rows, children first
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create all users and get rows back
  const createdUsers = await prisma.user.createManyAndReturn({
    data: users,
  });

  // 3. Lookup: username -> id
  const userMap = new Map();
  for (const u of createdUsers) {
    userMap.set(u.username, u.id);
  }

  // 4. Create all posts replacing author with authorId
  const postData = posts.map((p) => ({
    imageUrl: p.imageUrl,
    caption: p.caption,
    location: p.location,
    authorId: userMap.get(p.author),
    createdAt: p.createdAt,
  }));
  const createdPosts = await prisma.post.createManyAndReturn({
    data: postData,
  });

  // 5. Lookup: insta## -> post id
  const postMap = new Map();
  for (const p of createdPosts) {
    const key = p.imageUrl.split("/")[4];
    postMap.set(key, p.id);
  }

  // 6. Create all likes in one query
  const likeData = likes.map((l) => ({
    userId: userMap.get(l.user),
    postId: postMap.get(l.post),
  }));
  const createdLikes = await prisma.like.createMany({
    data: likeData,
  });

  // 7. Print seeded counts
  console.log(`🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${createdLikes.count} likes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
