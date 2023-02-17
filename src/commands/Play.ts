import { Colors, SlashCommandBuilder } from "discord.js";

import { Command } from "../types/Command.js";
import { QueueController } from "../types/QueueController.js";
import { EmbedFactory } from "../utils/EmbedFactory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Query to search for.")
        .setRequired(true)
    ),
  aliases: ["p"],
  execute: async (interaction, guild, client) => {
    if (!interaction.member.voice.channel) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ | Error")
        .setDescription("You have to be in a voice channel!")
        .setMemberFooter(interaction.member)
        .create();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const searchResult = await QueueController.search(
      interaction,
      client,
      interaction.options.getString("query")
    );
    if (!searchResult) return;

    const queue = await QueueController.createQueue(interaction, guild, client);

    QueueController.addToQueue(queue, searchResult, false, interaction, guild);
  },
} as Command;
