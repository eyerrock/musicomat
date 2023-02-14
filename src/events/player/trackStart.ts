import { Queue, QueueRepeatMode, Track } from "discord-player";
import { Colors } from "discord.js";

import { PlayerEvent } from "../../types/Event.js";
import { Metadata } from "../../types/QueueController.js";
import { EmbedFactory } from "../../utils/EmbedFactory.js";

export default {
  name: "trackStart",
  once: false,
  execute: async (player, queue: Queue<Metadata>, track: Track) => {
    if (!queue.metadata) return console.log("Queue has no valid metadata!");

    const fields = [
      { name: "Title", value: track.title, inline: true },
      { name: "Artist", value: track.author, inline: true },
      { name: "Duration", value: track.duration, inline: true },
      {
        name: "Next Up",
        value:
          queue.tracks.length > 0
            ? `[${queue.tracks[0].title}](${queue.tracks[0].url})`
            : "-",
      },
    ];
    if (queue.repeatMode !== QueueRepeatMode.OFF) {
      fields.push({
        name: "Repeat Mode",
        value: QueueRepeatMode[queue.repeatMode],
      });
    }

    const embed = new EmbedFactory()
      .setColor(Colors.Purple)
      .setThumbnail(track.thumbnail)
      .setTitle("📀 Now Playing")
      .setDescription(`**[${track.title}](${track.url})**`)
      .addFields(...fields)
      .setFooter({
        text: "queued by " + queue.metadata.member.displayName,
        iconURL: queue.metadata.member.displayAvatarURL(),
      })
      .create();

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
