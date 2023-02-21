import { Colors, Events, Interaction } from "discord.js";

import { GuildController } from "../../database/controllers/GuildController.js";
import { CommandGuard } from "../../guards/CommandGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { Client } from "../../types/Client.js";
import { CommandError } from "../../types/Command.js";
import { ClientEvent } from "../../types/Event.js";

export default {
  name: Events.InteractionCreate,
  once: false,
  execute: async (client: Client, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        const embed = new EmbedFactory()
          .setColor(Colors.Red)
          .setTitle("❌ | Error")
          .setDescription("Command not found!");

        return interaction.reply({ embeds: [embed] });
      }

      if (!interaction.guild) return;
      const guild = await GuildController.findOneOrCreateGuild(
        interaction.guild.id
      );

      if (!CommandGuard.checkInteraction(interaction)) return;
      try {
        await command.execute(interaction, guild, client);
      } catch (err) {
        console.error(err);

        let embed;
        if (err instanceof CommandError)
          embed = new EmbedFactory()
            .setColor(Colors.Red)
            .setTitle("❌ | Error")
            .setDescription("An error occurred while executing the command!")
            .addFields({ name: "Message", value: err.message });
        else {
          embed = new EmbedFactory()
            .setColor(Colors.Red)
            .setTitle("❌ | Error")
            .setDescription("An internal error occurred!")
            .addFields({
              name: "Message",
              value:
                "Command execution failed! Error will be logged to console.",
            })
            .setFooter({
              text: "Error",
              iconURL: client.user?.displayAvatarURL(),
            });
        }

        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.reply({ embeds: [embed] });
        }
      }
    }
  },
} as ClientEvent;
