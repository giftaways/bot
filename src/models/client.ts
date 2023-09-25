import {
  Client,
  GatewayIntentBits,
  Collection,
  LimitedCollection,
  Events,
} from "discord.js";
import { getInfo, ClusterClient } from "discord-hybrid-sharding";
import { Button, ChatInputCommand } from "../interfaces";
import { handleClientReady } from "../events/ready";
import { handleInteractionCreate } from "../events/interactionCreate";
import { fileToCollection } from "../utils/fileToCollection";
import path from "path";

export default class ExtendedClient extends Client {
  readonly commands: Collection<string, ChatInputCommand>;
  readonly cluster: ClusterClient<Client>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
      makeCache: (manager) => {
        switch (manager.name) {
          case "ReactionUserManager":
            return new LimitedCollection({ maxSize: 0 });
          case "GuildMemberManager":
            return new LimitedCollection({
              maxSize: 20000,
              keepOverLimit: (member) => member.id === member.client.user.id,
            });
          case "UserManager":
            return new LimitedCollection({
              maxSize: 20000,
              keepOverLimit: (user) => user.id === user.client.user.id,
            });
          default:
            return new Collection();
        }
      },
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    const commandPath = path.join(__dirname, "..", "commands");

    this.commands = fileToCollection<ChatInputCommand>(commandPath);
    this.cluster = new ClusterClient(this);

    this.on(Events.ClientReady, (client) =>
      handleClientReady(client as ExtendedClient)
    );
    this.on(Events.InteractionCreate, (interaction) =>
      handleInteractionCreate(this, interaction)
    );
  }
}
