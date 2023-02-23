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

    const latency = interaction.client.ws.ping;

    console.log(interaction.commandName);

    const embed = new EmbedFactory()
      .setColor(Colors.Orange)
      .setTitle("🏓 ┃ **Pong!**")
      .setDescription(`Greetings, ${interaction.member}!`)
      .addFields({ name: "Latency", value: `${latency} ms` })
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
