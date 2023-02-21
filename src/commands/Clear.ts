import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the Queue.")
    .setDMPermission(false),
  execute: async (interaction, guild, client) => {
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ | No Queue")
        .setDescription("There is no queue to clear!")
        .setMemberFooter(interaction.member);

      await interaction.followUp({ embeds: [embed], ephemeral: true });
      return;
    }

    const oldLength = queue.tracks.length;

    queue.clear();

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🗑️ | Queue cleared")
      .setDescription(`Cleared **${oldLength}** songs from the queue!`)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
