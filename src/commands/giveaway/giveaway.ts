import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import ExtendedClient from "../../models/client";
import { parseTimeOffset } from "../../utils/parseTimeOffset";

export function getEnterButton() {
  const enterButton = new ButtonBuilder()
    .setCustomId("enter")
    .setLabel("Enter")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(false)
    .setEmoji("<:giftaways:1156600166997045318>");
  const viewButton = new ButtonBuilder()
    .setLabel("View giveaway")
    .setStyle(ButtonStyle.Link)
    .setDisabled(false)
    .setURL("https://giftaways.xyz");
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    enterButton,
    viewButton
  );
}

export async function getGiveawayEmbed(
  date: Date,
  prize: string,
  winners: number,
  client: ExtendedClient
): Promise<EmbedBuilder> {
  var unix = Math.floor(date.getTime() / 1000);
  const embed = new EmbedBuilder()
    .setColor("#00d49e")
    .setFooter({
      text: `${client.user?.username}`,
    })
    .setTimestamp()
    .setTitle(prize)
    .setDescription(
      `Click <:giftaways:1156600166997045318> to enter!\nWinners: **${winners}**\nEnds at: <t:${unix}:R>`
    );

  return embed;
}

function getErrorEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor("#e74d3c")
    .setAuthor({
      name: "Invalid time format",
      iconURL: "https://imgur.com/reasPf4.png",
    })
    .setDescription("Please make sure to use time variables.");

  return embed;
}

const command: ChatInputCommand = {
  options: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a new Giveaway")
    .setDescriptionLocalizations({
      de: "Erstelle eine neue Verlosung",
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new Giveaway")
        .setDescriptionLocalizations({
          de: "Erstelle eine neue Verlosung",
        })
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The duration for this giveaway (min)")
            .setDescriptionLocalizations({
              de: "Die Dauer diese Verlosung (min)",
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("The prize of this giveaway")
            .setDescriptionLocalizations({
              de: "Der Preis dieser Verlosung",
            })
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("winners")
            .setDescription("The number of winners for this giveaway")
            .setDescriptionLocalizations({
              de: "Die Anzahl an Gewinnern für diese Verlosung",
            })
            .setRequired(true)
        )
    ),
  global: true,
  execute: async (client, interaction) => {
    var sub = interaction.options.getSubcommand();

    switch (sub) {
      case "create":
        const duration = interaction.options.getString("duration") || "";
        const prize = interaction.options.getString("prize") || "";
        const winners = interaction.options.getNumber("winners") || 1;

        var date = parseTimeOffset(duration);

        if (date === null) {
          await interaction.reply({
            embeds: [getErrorEmbed()],
            ephemeral: true,
          });
          return;
        }

        var embed = await getGiveawayEmbed(date, prize, winners, client);

        interaction.reply({
          embeds: [embed],
          components: [getEnterButton()],
          ephemeral: true,
        });
        break;

      default:
        break;
    }
  },
};
export default command;
