import GiftawaysClient from "./models/client";

const client = new GiftawaysClient();
client.login(process.env.CLIENT_TOKEN).then(() => {
  console.log("Client successfully logged in");
});
