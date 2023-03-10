import { GuildQueue } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { EmbedFactory } from "../../helpers/EmbedFactory.js";
import { PlayerEvent } from "../../types/Event.js";

export default {
  name: "playerError",
  once: false,
  execute: async (player, queue: GuildQueue, error: Error) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    console.log("Connection error: ", error);

    const embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("❌ ┃ **Connection Error**")
      .setDescription(
        "An error occurred while connecting to the voice channel."
      )
      .addFields({ name: "Message", value: error.message })
      .setMemberFooter(queue.metadata.member);

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
