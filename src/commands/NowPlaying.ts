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
    const queue = await QueueController.getQueueByGuild(client, interaction);
    if (!queue) return;

    await interaction.deferReply();

    const progress = queue.createProgressBar({ timecodes: true, queue: true });
    const percentage = queue.getPlayerTimestamp().progress;

    const fields = [
      { name: "Title", value: queue.current.title, inline: true },
      { name: "Author", value: queue.current.author, inline: true },
      { name: "Duration", value: queue.current.duration, inline: true },
      {
        name: "Progress",
        value: `${progress} ┃ ${percentage} %`,
        inline: false,
      },
    ];

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🎶 ┃ **Now Playing**")
      .setThumbnail(queue.current.thumbnail)
      .addFields(fields)
      .setMemberFooter(interaction.member);

    await interaction.editReply({ embeds: [embed] });
  },
} as Command;
