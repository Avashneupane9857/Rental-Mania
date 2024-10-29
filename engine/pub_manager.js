import { createClient } from "redis";

export const publisherClient = createClient();
publisherClient.on("error", (err) => {
  console.log("Pub err", err);
});

export const pubClientConnect = async () => {
  if (!publisherClient.isOpen) {
    await publisherClient.connect();
  }
};
