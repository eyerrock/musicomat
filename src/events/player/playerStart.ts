import { GuildQueue, QueueRepeatMode, Track } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { PlayerEvent } from "../../types/Event.js";

export default {
  name: "playerStart",
  once: false,
  execute: async (player, queue: GuildQueue, track: Track) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    const fields = [
      { name: "Title", value: track.title, inline: true },
      { name: "Artist", value: track.author, inline: true },
      { name: "Duration", value: track.duration, inline: true },
      {
        name: "Next Up",
        value:
          queue.tracks.size > 0
            ? `[${queue.tracks.at(0)?.title}](${queue.tracks.at(0)?.url})`
            : "-",
      },
    ];
    if (queue.repeatMode !== QueueRepeatMode.OFF) {
      fields.push({
        name: "Loop Mode",
        value: QueueRepeatMode[queue.repeatMode],
      });
    }

    const embed = new EmbedFactory()
      .setColor(Colors.Purple)
      .setThumbnail(track.thumbnail)
      .setTitle("📀 ┃ **Now Playing**")
      .setDescription(`**[${track.title}](${track.url})**`)
      .addFields(...fields)
      .setFooter({
        text: "queued by " + queue.metadata.member.displayName,
        iconURL: queue.metadata.member.displayAvatarURL(),
      });

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
