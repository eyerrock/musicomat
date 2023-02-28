import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { Command } from "../types/Command.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!")
    .setDMPermission(false),
  execute: async (interaction) => {
    await interaction.deferReply();

    let embed = new EmbedFactory()
      .setColor(Colors.Orange)
      .setTitle("⏳ ┃ **Pinging ...**")
      .setDescription("Please wait a moment ...")
      .setMemberFooter(interaction.member);

    const sent = await interaction.followUp({
      embeds: [embed],
      fetchReply: true,
    });

    const ping = interaction.client.ws.ping;

    embed = new EmbedFactory()
      .setColor(Colors.Orange)
      .setTitle("🏓 ┃ **Pong!**")
      .setDescription(`Greetings, ${interaction.member}!`)
      .addFields(
        { name: "WebSocket Heartbeat", value: `${ping} ms` },
        {
          name: "API Roundtrip Latency",
          value: `${sent.createdTimestamp - interaction.createdTimestamp} ms`,
        }
      )
      .setMemberFooter(interaction.member);

    await interaction.editReply({ embeds: [embed] });
  },
} as Command;
