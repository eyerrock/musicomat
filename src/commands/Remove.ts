import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a song from the queue!")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Position of the song to remove.")
        .setMinValue(1)
        .setRequired(true)
    )
    .setDMPermission(false),
  aliases: ["rm"],
  execute: async (interaction, guild, client) => {
    const queue = await QueueController.getQueue(client, interaction);
    if (!queue) return;

    if (queue.tracks.size === 0) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Empty Queue**")
        .setDescription("There are no songs in the Queue!")
        .setMemberFooter(interaction.member);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const index = (interaction.options.getInteger("position") ?? 0) - 1;
    if (index < 0 || index >= queue.tracks.size) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Invalid Position**")
        .setDescription(
          "Position is out of bounds!\nPlease enter a valid position."
        )
        .addFields(
          {
            name: "min. Position",
            value: "1",
            inline: true,
          },
          {
            name: "max. Position",
            value: queue.tracks.size.toString(),
            inline: true,
          }
        )
        .setMemberFooter(interaction.member);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    const removed = queue.node.remove(index);
    if (!removed) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Error**")
        .setDescription("An error occurred while removing the song!")
        .setMemberFooter(interaction.member);

      await interaction.followUp({ embeds: [embed] });
      return;
    }

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🗑️ ┃ **Removed Song**")
      .setDescription(
        `Removed **[${removed.title}](${removed.url})** from the queue.`
      )
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
