import { GuildQueue, Player } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { PlayerEvent } from "../../types/Event.js";

export default {
  name: "emptyChannel",
  once: false,
  execute: async (player: Player, queue: GuildQueue) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    const embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("👋 ┃ **See ya!**")
      .setDescription(
        "No one is listening to music anymore, so I left the channel."
      )
      .setFooter({
        text: "Queue has been cleared.",
        iconURL: player.client.user?.displayAvatarURL(),
      });

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
