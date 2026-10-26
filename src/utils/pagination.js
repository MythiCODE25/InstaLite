function parsePagination(query) {
  let { page = "1", limit = "10" } = query;

  const isValidPositiveInt = (val) => {
    if (typeof val === "number") {
      return Number.isInteger(val) && val > 0;
    }
    if (typeof val === "string") {
      const trimmed = val.trim();
      return /^\d+$/.test(trimmed) && parseInt(trimmed, 10) > 0;
    }
    return false;
  };

  if (!isValidPositiveInt(page) || !isValidPositiveInt(limit)) {
    return {
      error: "page and limit must be positive integers",
    };
  }

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (limit > 50) {
    limit = 50;
  }

  return { page, limit };
}

module.exports = {
  parsePagination,
};
