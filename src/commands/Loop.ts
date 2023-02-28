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
    const queue = await QueueController.getQueueByGuild(client, interaction);
    if (!queue) return;

    await interaction.deferReply();

    const oldMode = queue.repeatMode;

    const mode = interaction.options.getInteger("mode") ?? 0;
    const success = queue.setRepeatMode(mode);

    if (oldMode !== mode && !success) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Error**")
        .setDescription("Failed to change the Loop Mode!")
        .setMemberFooter(interaction.member);

      await interaction.followUp({ embeds: [embed] });
      return;
    }

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
