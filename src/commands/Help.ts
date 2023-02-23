import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of all commands.")
    .setDMPermission(false),
  execute: async (interaction, guild, client) => {
    await interaction.deferReply();

    const fields = client.slashCommands.map((command) => {
      const options = command.data.toJSON().options ?? [{ name: "" }];
      const optionsString = options.map((o) => `\`<${o.name}>\``).join(" ");
      const aliases = command.aliases?.map((a) => `\`${a}\``).join(" ");
      return {
        name: `\`/${command.data.name}\` ${optionsString}`,
        value: `Description: ${command.data.description}\n${
          aliases ? `Aliases: ${aliases}` : ""
        }`,
      };
    });

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("📖 | Help Menu")
      .setDescription(
        "This is a list of commands you can use in this server.\n" +
          "To use a command, type `/<command> <options>`\n" +
          "For example, `/play https://www.youtube.com/watch?v=dQw4w9WgXcQ`"
      )
      .setFields(fields)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed], ephemeral: true });
  },
} as Command;
