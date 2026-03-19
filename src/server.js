import express from "express";
import AuthRouter from "./routes/auth.route.js";
import 'dotenv/config.js';
import UserRouter from "./routes/user.route.js";
import FollowRouter from "./routes/follow.route.js";
import FeedRouter from "./routes/feed.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/follow", FollowRouter);
app.use("/api/feed", FeedRouter);

app.listen(port, () => {
  console.log(`Cape deh ngulang port ${port} terus!`);
});
