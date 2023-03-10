import { GuildQueue, Player } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { PlayerEvent } from "../../types/Event.js";

export default {
  name: "emptyQueue",
  once: false,
  execute: async (player: Player, queue: GuildQueue) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    if (queue.metadata.destroyed) return;

    const delay = queue.metadata.guildData.onEndDelay * 1000;

    let embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("⏳ ┃ **Waiting ...**")
      .setDescription(
        `No more songs in Queue. Leaving in **${delay / 1000}** seconds.`
      )
      .setFooter({
        text: "waiting ...",
        iconURL: player.client.user?.displayAvatarURL(),
      });

    const msg = await queue.metadata.channel.send({ embeds: [embed] });

    setTimeout(async () => {
      embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("👋 ┃ **See ya!**")
        .setDescription("Left the voice channel.")
        .setFooter({
          text: "Bye!",
          iconURL: player.client.user?.displayAvatarURL(),
        });

      await msg.edit({ embeds: [embed] });

      if ((!queue || !queue.isPlaying()) && !queue.deleted)
        return queue.delete();
    }, delay);
  },
} as PlayerEvent;
