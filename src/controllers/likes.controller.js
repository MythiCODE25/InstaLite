const likesService = require("../services/likes.service");

async function getLikes(req, res) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(404).json({ error: "Post not found" });
    }
    const likes = await likesService.getLikesByPostId(postId);
    return res.status(200).json(likes);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function create(req, res) {
  try {
    const { userId } = req.body;
    if (userId === undefined || userId === null) {
      return res.status(400).json({ error: "userId is required" });
    }

    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(404).json({ error: "Post not found" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(404).json({ error: "User not found" });
    }

    const like = await likesService.likePost(postId, parsedUserId);
    return res.status(201).json(like);
  } catch (error) {
    if (error.status === 404 || error.status === 409) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(postId) || isNaN(userId)) {
      return res.status(404).json({ error: "Like not found" });
    }

    await likesService.unlikePost(postId, userId);
    return res.status(204).send();
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getLikes,
  create,
  remove,
};
