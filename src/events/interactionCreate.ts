import { ApplicationCommandType, CacheType, Interaction, InteractionType } from "discord.js";
import ExtendedClient from "../models/client";

export const handleInteractionCreate = async (client: ExtendedClient, interaction: Interaction<CacheType>) => {
    try {
        switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            switch (interaction.commandType) {
            case ApplicationCommandType.ChatInput:
                client.commands.get(interaction.commandName)?.execute(client, interaction);
                break;
            default:
                break;
            }
            break;
        default:
            break;
        }
    }
    catch (error) {
        console.error(error);
    }
}