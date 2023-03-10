import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows the currently playing song.")
    .setDMPermission(false),
  aliases: ["np"],
  execute: async (interaction, guild, client) => {
    const queue = await QueueController.getQueue(client, interaction);
    if (!queue) return;

    await interaction.deferReply();

    const progress = queue.node.createProgressBar({
      timecodes: true,
      queue: true,
    });
    const percentage = queue.node.getTimestamp()?.progress;

    if (!queue.currentTrack) {
      const embed = new EmbedFactory()
        .setColor(Colors.LuminousVividPink)
        .setTitle("🎶 ┃ **Now Playing**")
        .setDescription("Nothing is currently playing.")
        .setMemberFooter(interaction.member);

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const fields = [
      { name: "Title", value: queue.currentTrack.title, inline: true },
      { name: "Author", value: queue.currentTrack.author, inline: true },
      { name: "Duration", value: queue.currentTrack.duration, inline: true },
      {
        name: "Progress",
        value: `${progress} ┃ ${percentage} %`,
        inline: false,
      },
    ];

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🎶 ┃ **Now Playing**")
      .setThumbnail(queue.currentTrack.thumbnail)
      .addFields(fields)
      .setMemberFooter(interaction.member);

    await interaction.editReply({ embeds: [embed] });
  },
} as Command;
