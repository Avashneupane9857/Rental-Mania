import { v4 } from "uuid";
import { client, connectRedis } from "../RedisManager.js";
import { subClientConnect, subscriber } from "../Sub_Manager.js";

export const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const id = v4();
  await connectRedis();
  await subClientConnect();
  await client.LPUSH(
    "Queue1",
    JSON.stringify({ id, email, password, server: "Login" })
  );
  console.log("Pushed in queue login");

  subscriber(id, res);
};
