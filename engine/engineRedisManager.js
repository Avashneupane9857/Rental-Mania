import { createClient } from "redis";

export const engineClient = createClient();

engineClient.on("error", (err) => {
  console.log("redis is not connected", err);
});
export const engineClientConnect = async () => {
  if (!engineClient.isOpen) {
    await engineClient.connect();
  }
  console.log("engineClient is connetcted ");
};
