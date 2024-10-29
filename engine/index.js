import { Login } from "./engineControllers/Login.js";
import { engineClient, engineClientConnect } from "./engineRedisManager.js";
import { pubClientConnect, publisherClient } from "./pub_manager.js";

async function main() {
  await engineClientConnect();
  await pubClientConnect();
  while (true) {
    const response = await engineClient.BRPOP("Queue1", 0);
    const data = JSON.parse(response.element);

    switch (data.server) {
      case "Login":
        const engineValue = await Login(data.email, data.password);
        await publisherClient.publish(data.id, JSON.stringify(engineValue));
        break;
      default:
        console.log("Router not found");
    }
  }
}
main();
