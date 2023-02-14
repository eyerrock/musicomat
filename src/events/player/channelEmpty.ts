import { Player, Queue } from "discord-player";
import { Colors } from "discord.js";

import { PlayerEvent } from "../../types/Event.js";
import { Metadata } from "../../types/QueueController.js";
import { EmbedFactory } from "../../utils/EmbedFactory.js";

export default {
  name: "channelEmpty",
  once: false,
  execute: async (player: Player, queue: Queue<Metadata>) => {
    if (!queue.metadata) return console.log("Queue has no valid metadata!");

    const embed = new EmbedFactory()
      .setColor(Colors.Red)
      .setTitle("👋 See you soon!")
      .setDescription(
        "No one is listening to music anymore, so I left the channel."
      )
      .setFooter({
        text: "Queue has been cleared.",
        iconURL: player.client.user?.displayAvatarURL(),
      })
      .create();

    await queue.metadata.channel.send({ embeds: [embed] });
  },
} as PlayerEvent;
