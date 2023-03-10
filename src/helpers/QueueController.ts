import {
  GuildQueue,
  Player,
  Playlist,
  QueryType,
  SearchResult,
  Track,
} from "discord-player";
import {
  APIInteractionGuildMember,
  Colors,
  Guild,
  GuildMember,
  TextBasedChannel,
} from "discord.js";

import { IGuild } from "../database/interfaces/IGuild.js";
import { GuardedChatInputCommandInteraction } from "../guards/CommandGuard.js";
import { EmbedFactory } from "../helpers/EmbedFactory.js";
import { Client } from "../types/Client.js";
import { CommandError } from "../types/Command.js";
import { msToHHMMSS } from "../utils/msToHHMMSS.js";
import { validateURL } from "../utils/validateURL.js";

export type Metadata = {
  channel: TextBasedChannel;
  guild: Guild;
  guildData: IGuild;
  member: GuildMember | (APIInteractionGuildMember & GuildMember);
  destroyed: boolean;
};

export abstract class QueueController {
  public static getQueue = async (
    client: Client,
    interaction: GuardedChatInputCommandInteraction
  ) => {
    const queue = Player.singleton(client).nodes.get(interaction.guild);

    if (!queue) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Queue not found**")
        .setDescription("Could not find a Queue!")
        .setMemberFooter(interaction.member);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    return queue;
  };

  public static search = async (
    interaction: GuardedChatInputCommandInteraction,
    client: Client,
    query: string | null
  ): Promise<SearchResult | void> => {
    if (!query) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Error**")
        .setDescription("You have to provide a search query!")
        .setMemberFooter(interaction.member);

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    const embed = new EmbedFactory()
      .setColor(Colors.Yellow)
      .setTitle("🔍 ┃ **Searching ...**")
      .setDescription(`Searching for \`${query}\` ...`)
      .setMemberFooter(interaction.member);

    await interaction.followUp({ embeds: [embed] });

    const searchResult = await Player.singleton(client).search(query, {
      requestedBy: interaction.member,
      searchEngine: validateURL(query)
        ? QueryType.AUTO
        : QueryType.YOUTUBE_SEARCH,
    });

    if (!searchResult || !searchResult.tracks.length) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ ┃ **Error**")
        .setDescription("No results found!")
        .setMemberFooter(interaction.member);

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    return searchResult;
  };

  public static createQueue = async (
    interaction: GuardedChatInputCommandInteraction,
    guild: IGuild,
    client: Client
  ) => {
    if (!interaction.channel) throw new CommandError("Channel is not defined!");
    if (!interaction.member.voice.channel)
      throw new CommandError(
        "You have to be in a voice channel to use this command!"
      );

    const queue = Player.singleton(client).nodes.create(interaction.guild, {
      leaveOnStop: false,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: guild.onEmptyDelay * 1000,
      leaveOnEnd: false,
      metadata: {
        channel: interaction.channel,
        guild: interaction.guild,
        guildData: guild,
        member: interaction.member,
        destroyed: false,
      },
      bufferingTimeout: 1000,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch (err) {
      Player.singleton(client).nodes.delete(interaction.guild);
      throw new CommandError("Could not join your voice channel!");
    }

    return queue;
  };

  static addToQueue = async (
    queue: GuildQueue,
    searchResult: SearchResult,
    playOnTop: boolean,
    interaction: GuardedChatInputCommandInteraction,
    guild: IGuild
  ) => {
    let toPlay: Track | Playlist;
    let duration = 0;
    if (searchResult.playlist) {
      if (playOnTop) {
        searchResult.tracks.reverse().forEach((track) => {
          queue.insertTrack(track, 0);
        });
      } else {
        queue.addTrack(searchResult.tracks);
      }
      toPlay = searchResult.playlist;
      toPlay.thumbnail = searchResult.playlist.thumbnail;
      for (const track of searchResult.tracks) {
        duration += track.durationMS;
      }
    } else {
      if (playOnTop) {
        queue.insertTrack(searchResult.tracks[0], 0);
      } else {
        queue.addTrack(searchResult.tracks[0]);
      }
      toPlay = searchResult.tracks[0];
    }

    const embed = new EmbedFactory()
      .setColor(Colors.Green)
      .setTitle(
        `🎶 ┃ ** Added ${searchResult.playlist ? "Playlist" : "Song"} ${
          playOnTop ? "on top of" : "to"
        } the Queue **`
      )
      .setThumbnail(toPlay.thumbnail)
      .setDescription(`**[${toPlay.title}](${toPlay.url})**`)
      .addFields(
        { name: "Title", value: toPlay.title, inline: true },
        {
          name: "Author",
          value:
            toPlay.author instanceof Object
              ? toPlay.author.name
              : toPlay.author,
          inline: true,
        },
        {
          name: "Duration",
          value: searchResult.playlist
            ? msToHHMMSS(duration)
            : searchResult.tracks[0].duration,
          inline: true,
        }
      )
      .setMemberFooter(interaction.member);

    if (!queue.isPlaying()) await queue.node.play();
    queue.node.setVolume(guild.volume);

    await interaction.editReply({ embeds: [embed] });
  };
}
