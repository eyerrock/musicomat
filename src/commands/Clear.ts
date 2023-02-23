import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the Queue.")
    .setDMPermission(false),
  execute: async (interaction, guild, client) => {
    await interaction.deferReply();

    const queue = await QueueController.getQueueByGuild(client, interaction);
    if (!queue) return;

    const oldLength = queue.tracks.length;

    queue.clear();

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("🗑️ | Queue cleared")
      .setDescription(`Cleared **${oldLength}** songs from the queue!`)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
