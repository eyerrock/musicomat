import { Colors, SlashCommandBuilder } from "discord.js";

import { MetadataGuard } from "../guards/MetadataGuard.js";
import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { QueueController } from "../helpers/QueueController.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current Queue.")
    .setDMPermission(false),
  aliases: ["dc", "disconnect"],
  execute: async (interaction, guild, client) => {
    const queue = await QueueController.getQueue(client, interaction);
    if (!queue) return;

    await interaction.deferReply();

    if (!MetadataGuard.guardMetadata(queue)) return;
    queue.metadata.destroyed = true;

    queue.delete();

    const embed = new EmbedFactory()
      .setColor(Colors.LuminousVividPink)
      .setTitle("💥 ┃ **Queue destroyed**")
      .setDescription(`Queue has been destroyed!`)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
