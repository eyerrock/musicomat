import { Colors, Interaction } from "discord.js";

import { Client } from "../../types/Client.js";
import { CommandError } from "../../types/Command.js";
import { ClientEvent } from "../../types/Event.js";
import { EmbedFactory } from "../../utils/EmbedFactory.js";

export default {
  name: "interactionCreate",
  once: false,
  execute: async (client: Client, interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription("Command not found!")
        .create();

      return interaction.reply({ embeds: [embed] });
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);

      let embed;
      if (err instanceof CommandError)
        embed = new EmbedFactory()
          .setColor(Colors.Red)
          .setTitle("Error")
          .setDescription("An internal error occurred!")
          .addFields({ name: "Message", value: err.message })
          .create();
      else {
        embed = new EmbedFactory()
          .setColor(Colors.Red)
          .setTitle("Error")
          .setDescription("An internal error occurred!")
          .addFields({
            name: "Message",
            value: "Command execution failed! Error will be logged to console.",
          })
          .setFooter({
            text: "Error",
            iconURL: client.user?.displayAvatarURL(),
          })
          .create();
      }

      await interaction.reply({ embeds: [embed] });
    }
  },
} as ClientEvent;
