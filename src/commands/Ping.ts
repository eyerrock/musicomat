import { Colors, GuildMember, SlashCommandBuilder } from "discord.js";

import { Command } from "../types/Command.js";
import { EmbedFactory } from "../utils/EmbedFactory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!")
    .setDMPermission(false),
  execute: async (interaction) => {
    if (!(interaction.member instanceof GuildMember)) return;

    await interaction.deferReply();

    const latency = interaction.client.ws.ping;

    const embed = new EmbedFactory()
      .setColor(Colors.Orange)
      .setTitle("Pong!")
      .setDescription(`Greetings, ${interaction.member}!`)
      .addFields({ name: "Latency", value: `${latency} ms` })
      .setMemberFooter(interaction.member)
      .create();

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
