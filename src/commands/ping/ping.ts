import {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import ExtendedClient from "../../models/client";

export async function getPingEmbed(
  client: ExtendedClient,
  ping: number
): Promise<EmbedBuilder> {
  const embed = new EmbedBuilder()
    .setColor("#00d49e")
    .setFooter({
      text: `Cluster ${client.cluster.id}`,
    })
    .setTimestamp()
    .addFields(
      {
        name: "Shard Latency",
        value: `> **${ping}**ms`,
        inline: false,
      },
      {
        name: "Api Latency",
        value: `> **${Math.round(client.ws.ping)}**ms`,
        inline: false,
      }
    );

  return embed;
}

const command: ChatInputCommand = {
  options: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check Giftaway's ping")
    .setDescriptionLocalizations({
      de: "Überprüfe Giftaway's Ping",
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
  global: true,
  execute: async (client, interaction) => {
    const shardPing = Math.abs(Date.now() - interaction.createdTimestamp);
    var embed = await getPingEmbed(client, shardPing);

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
export default command;
