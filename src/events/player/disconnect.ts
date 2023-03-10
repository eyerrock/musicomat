import { GuildQueue, Player } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { PlayerEvent } from "../../types/Event.js";

export default {
  name: "disconnect",
  once: false,
  execute: async (player: Player, queue: GuildQueue) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    const embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("🛑 ┃ **Disconnected**")
      .setDescription("I was disconnected from the voice channel.")
      .setFooter({
        text: "See you soon!",
        iconURL: player.client.user?.displayAvatarURL(),
      });

    try {
      await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log("Seems like access to the channel was revoked: ", error);
    }
  },
} as PlayerEvent;
