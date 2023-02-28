import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("playtop")
    .setDescription("Play a song at the top of the Queue!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Query to search for.")
        .setRequired(true)
    ),
  aliases: ["pt"],
  execute: async (interaction, guild, client) => {
    if (!interaction.member.voice.channel) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Error**")
        .setDescription("You have to be in a voice channel!")
        .setMemberFooter(interaction.member);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const searchResult = await QueueController.search(
      interaction,
      client,
      interaction.options.getString("query")
    );
    if (!searchResult) return;

    const queue = await QueueController.createQueue(interaction, guild, client);

    QueueController.addToQueue(queue, searchResult, true, interaction, guild);
  },
} as Command;
