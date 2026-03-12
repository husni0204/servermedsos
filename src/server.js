import express from "express";
import AuthRouter from "./routes/auth.route.js";
import 'dotenv/config.js';
import UserRouter from "./routes/user.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Cape deh ngulang port ${port} terus!`);
});
