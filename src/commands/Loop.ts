import { QueueRepeatMode } from "discord-player";
import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Change the loop mode of the Queue.")
    .addIntegerOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop mode to set.")
        .setRequired(true)
        .addChoices(
          { name: "OFF", value: QueueRepeatMode.OFF },
          { name: "TRACK", value: QueueRepeatMode.TRACK },
          { name: "QUEUE", value: QueueRepeatMode.QUEUE },
          { name: "AUTOPLAY", value: QueueRepeatMode.AUTOPLAY }
        )
    )
    .setDMPermission(false),
  aliases: ["repeat"],
  execute: async (interaction, guild, client) => {
    const queue = await QueueController.getQueue(client, interaction);
    if (!queue) return;

    await interaction.deferReply();

    const mode = interaction.options.getInteger("mode") ?? 0;
    queue.setRepeatMode(mode);

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🔁 ┃ **Loop Mode changed**")
      .setDescription(
        `Loop Mode has been changed to **${
          QueueRepeatMode[queue.repeatMode]
        }**!`
      )
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
