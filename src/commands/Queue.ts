import { QueueRepeatMode } from "discord-player";
import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";
import { msToHHMMSS } from "../utils/msToHHMMSS.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the current queue.")
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page to show")
        .setMinValue(1)
        .setRequired(false)
    ),
  aliases: ["q"],
  execute: async (interaction, guild, client) => {
    await interaction.deferReply();

    const queue = await QueueController.getQueueByGuild(client, interaction);
    if (!queue) return;

    const page = interaction.options.getInteger("page") ?? 1;
    const pageStart = (page - 1) * 10;
    const pageEnd = pageStart + 10;
    const tracks = queue.tracks.slice(pageStart, pageEnd).map((t, i) => {
      return `${i + pageStart + 1}. [**${t.title}**](${t.url})`;
    });

    let duration = 0;
    queue.tracks.forEach((t) => (duration += t.durationMS));
    const durationString = msToHHMMSS(duration);

    let queueText = "";
    let thumbnail = null;
    if (tracks.length === 0) {
      queueText = "No songs in queue!";
    } else {
      queueText = `${tracks.join("\n")}${
        queue.tracks.length > pageEnd
          ? `\n... ${queue.tracks.length - pageEnd} more songs`
          : ""
      }`;
      thumbnail = queue.tracks[0].thumbnail;
    }

    let maxPages = Math.ceil(queue.tracks.length / 5);
    if (maxPages === 0) maxPages = 1;

    const pageText = `Page ${
      interaction.options.getInteger("page") || 1
    } of ${maxPages}`;

    const fields = [
      { name: "Queue", value: queueText },
      { name: "Duration", value: durationString },
      {
        name: "Now Playing",
        value: queue.current
          ? `[**${queue.current.title}**](${queue.current.url})`
          : "Nothing playing",
      },
    ];
    if (queue.repeatMode !== QueueRepeatMode.OFF) {
      fields.push({
        name: "Repeat Mode",
        value: QueueRepeatMode[queue.repeatMode],
      });
    }
    fields.push({ name: "Page", value: pageText });

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🎶 | Queue")
      .setThumbnail(thumbnail)
      .setDescription(`Queue for **${interaction.guild.name}**`)
      .addFields(fields)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
