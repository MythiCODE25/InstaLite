const express = require("express");
const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

const PORT = 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;