import { createClient } from "redis";

export const subscriberClient = createClient();
subscriberClient.on("error", (err) => {
  console.log("subs redis is not connected", err);
});
export const subClientConnect = async () => {
  if (!subscriberClient.isOpen) {
    await subscriberClient.connect();
  }
};

export const subscriber = async (id, res) => {
  try {
    await subscriberClient.subscribe(id, (msg) => {
      console.log(`Recieved msg`, msg);
      res.send(msg);
    });
    console.log(`subcriber uuid is  `, id);
  } catch (error) {
    console.log("its the error of subscriber ", error);
  }
};
