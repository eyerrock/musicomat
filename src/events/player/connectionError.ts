import { Queue } from "discord-player";
import { Colors } from "discord.js";

import { MetadataGuard } from "../../guards/MetadataGuard.js";
import { PlayerEvent } from "../../types/Event.js";
import { EmbedFactory } from "../../utils/EmbedFactory.js";

export default {
  name: "connectionError",
  once: false,
  execute: async (player, queue: Queue, error: Error) => {
    if (!MetadataGuard.guardMetadata(queue))
      return console.log("Queue has no valid metadata!");

    console.log("Connection error: ", error);

    const embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("❌ | Connection Error")
      .setDescription(
        "An error occurred while connecting to the voice channel."
      )
      .addFields({ name: "Message", value: error.message })
      .setMemberFooter(queue.metadata.member)
      .create();

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
