import express from "express";
import AuthRouter from "./routes/auth.route.js";
import 'dotenv/config.js';
import UserRouter from "./routes/user.route.js";
import FollowRouter from "./routes/follow.route.js";
import FeedRouter from "./routes/feed.route.js";
import CommentRouter from "./routes/comment.route.js";
import LikesRouter from "./routes/likes.route.js";
import BookmarkRouter from "./routes/bookmark.route.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
// const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/follow", FollowRouter);
app.use("/api/feed", FeedRouter);
app.use("/api/comment", CommentRouter);
app.use("/api/like", LikesRouter);
app.use("/api/bookmark", BookmarkRouter)

app.listen(port, () => {
  console.log(`Cape deh ngulang port ${port} terus!`);
});
