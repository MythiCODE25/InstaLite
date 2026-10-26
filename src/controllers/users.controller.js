const usersService = require("../services/users.service");
const { parsePagination } = require("../utils/pagination");

async function create(req, res) {
  try {
    const { username, email, fullname, bio } = req.body;
    if (!username || !email || !fullname) {
      return res.status(400).json({ error: "username, email and fullname are required" });
    }
    const user = await usersService.createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    // 1. Pagination
    const pagination = parsePagination(req.query);
    if (pagination.error) {
      return res.status(400).json({ error: pagination.error });
    }
    const { page, limit } = pagination;

    // 2. Sorting
    const { sortBy = "createdAt", order = "desc" } = req.query;
    const allowedSortBy = ["createdAt", "username", "fullname"];
    if (!allowedSortBy.includes(sortBy)) {
      return res.status(400).json({ error: "sortBy must be one of: createdAt, username, fullname" });
    }
    const allowedOrder = ["asc", "desc"];
    if (!allowedOrder.includes(order)) {
      return res.status(400).json({ error: "order must be asc or desc" });
    }

    // 3. Filtering
    let isPrivate;
    if (req.query.isPrivate !== undefined) {
      if (req.query.isPrivate === "true") {
        isPrivate = true;
      } else if (req.query.isPrivate === "false") {
        isPrivate = false;
      } else {
        return res.status(400).json({ error: "isPrivate must be true or false" });
      }
    }

    const search = req.query.search;

    const result = await usersService.listUsers({
      page,
      limit,
      sortBy,
      order,
      isPrivate,
      search,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateData = {};
    if (req.body.fullname !== undefined) updateData.fullname = req.body.fullname;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.isPrivate !== undefined) updateData.isPrivate = req.body.isPrivate;

    const user = await usersService.updateUser(id, updateData);
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "User not found" });
    }
    await usersService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};
