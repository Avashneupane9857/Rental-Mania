import express from "express";

import routes from "./route.js";

const app = express();
app.use(express.json());
app.use("/api", routes);
app.get("/", async (req, res) => {
  res.json({ msg: "Server is healthy avash" });
  // const cleanDatabase = await prisma.user.deleteMany();
  // console.log(cleanDatabase.count);
});
app.listen(3000, () => {
  console.log(`listening to port 3000`);
});
