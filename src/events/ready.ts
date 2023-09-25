import {
  ApplicationCommand,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import ExtendedClient from "../models/client";

export const handleClientReady = async (client: ExtendedClient) => {
  client.user?.setPresence({
    activities: [{ name: "giftaways.xyz" }],
    status: "online",
  });

  const rest = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN as string
  );
  var globalCommands = Array.from(
    client.commands.filter((x) => x.global === true).values()
  ).map((x) => x.options.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];

  const applicationCommands = (await rest
    .put(Routes.applicationCommands(client.user?.id as string), {
      body: globalCommands,
    })
    .catch(console.error)) as ApplicationCommand[];

  console.log(`Deployed ${applicationCommands.length} global command(s)`);
};
