import { Colors, SlashCommandBuilder } from "discord.js";

import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { W2GAPIResponse } from "../types/API.js";
import { Command } from "../types/Command.js";
import { validateURL } from "../utils/validateURL.js";

export default {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Creates a W2G-Room for the given URL.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL of the video to watch.")
        .setRequired(true)
    )
    .setDMPermission(false),
  aliases: ["w2g", "w"],
  execute: async (interaction, guild, client) => {
    const url = interaction.options.getString("url") ?? "";
    if (!validateURL(url)) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ Invalid URL")
        .setDescription(
          "The given URL is not valid!\nPlease try again with a valid URL."
        )
        .setMemberFooter(interaction.member);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    let data = null;
    let res = null;
    try {
      res = await fetch("https://api.w2g.tv/rooms/create.json", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          w2g_api_key: client.config.w2gApiKey,
          share: url,
          bg_color: "#2F2F2F",
          bg_opacity: "100",
        }),
      });

      data = (await res.json()) as W2GAPIResponse;
    } catch (err) {
      console.log(err);
      data = null;
    }

    if (!res?.ok || !data) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ Error")
        .setDescription("An error occured while creating the room!")
        .addFields(
          {
            name: "Status Code",
            value: res?.status.toString() ?? "Unknown",
            inline: true,
          },
          {
            name: "Status Text",
            value: res?.statusText ?? "Unknown",
            inline: true,
          }
        )
        .setMemberFooter(interaction.member);

      await interaction.followUp({ embeds: [embed] });
      return;
    }

    const embed = new EmbedFactory()
      .setColor(Colors.Aqua)
      .setTitle("📺 ┃ Watch Together")
      .setDescription(
        `Click [**here**](https://w2g.tv/rooms/${data.streamkey}) to join the room!`
      )
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });
  },
} as Command;
