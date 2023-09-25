import LymeClient from "./models/client";

const client = new LymeClient();
client.login(process.env.CLIENT_TOKEN).then(() => {
  console.log("Client successfully logged in");
});
