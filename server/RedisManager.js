import { createClient } from "redis";

export const client = createClient();

client.on("error", (err) => {
  console.log("redis is not connected", err);
});
export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  console.log("Client is connetcted ");
};
//Regular operation manager (LPUSH,BROP manager)
