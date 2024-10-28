import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Helloooo suksham bhiaya");
});
app.listen(3000, () => {
  console.log(`listening to port 3000`);
});
