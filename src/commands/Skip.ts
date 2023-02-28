import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song.")
    .setDMPermission(false),
  aliases: ["fs", "next"],
  execute: async (interaction, guild, client) => {
    await interaction.deferReply();

    const queue = await QueueController.getQueueByGuild(client, interaction);
    if (!queue) return;

    const currentTrack = queue.current;
    const success = queue.skip();

    const embed = new EmbedFactory()
      .setColor(success ? Colors.LuminousVividPink : Colors.Red)
      .setTitle(success ? "⏭️ ┃ **Skipped**" : "❌ ┃ **Error**")
      .setDescription(
        success
          ? `[**${currentTrack.title}**](${currentTrack.url}) has been skipped.`
          : "Failed to skip the current song!"
      )
      .setMemberFooter(interaction.member);

    interaction.followUp({ embeds: [embed] });
  },
} as Command;
