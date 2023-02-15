import {
  PlayerSearchResult,
  Playlist,
  QueryType,
  Queue,
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
import { EmbedFactory } from "../utils/EmbedFactory.js";
import { msToHHMMSS } from "../utils/msToHHMMSS.js";
import { validateURL } from "../utils/validateURL.js";
import { Client } from "./Client.js";
import { CommandError } from "./Command.js";

export type Metadata = {
  channel: TextBasedChannel;
  guild: Guild;
  member: GuildMember | (APIInteractionGuildMember & GuildMember);
};

export abstract class QueueController {
  public static getQueueByGuild = (
    interaction: GuardedChatInputCommandInteraction,
    client: Client
  ) => {
    return client.player.getQueue(interaction.guild);
  };

  public static search = async (
    interaction: GuardedChatInputCommandInteraction,
    client: Client,
    query: string | null
  ): Promise<PlayerSearchResult | void> => {
    if (!query) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ | Error")
        .setDescription("You have to provide a search query!")
        .setMemberFooter(interaction.member)
        .create();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.deferReply();

    const embed = new EmbedFactory()
      .setColor(Colors.Yellow)
      .setTitle("🔍 | Searching ...")
      .setDescription(`Searching for ${query} ...`)
      .setMemberFooter(interaction.member)
      .create();

    await interaction.followUp({ embeds: [embed] });

    const searchResult = await client.player.search(query, {
      requestedBy: interaction.member,
      searchEngine: validateURL(query)
        ? QueryType.AUTO
        : QueryType.YOUTUBE_SEARCH,
    });

    if (!searchResult || !searchResult.tracks.length) {
      const embed = new EmbedFactory()
        .setColor(Colors.Red)
        .setTitle("❌ | Error")
        .setDescription("No results found!")
        .setMemberFooter(interaction.member)
        .create();

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
    const queue = client.player.createQueue(interaction.guild, {
      ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
      },
      leaveOnStop: false,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: guild.onEmptyDelay * 1000,
      leaveOnEnd: true,
      leaveOnEndCooldown: guild.onEndDelay * 1000,
      metadata: {
        channel: interaction.channel,
        guild: interaction.guild,
        member: interaction.member,
      },
      bufferingTimeout: 1000,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch (err) {
      client.player.deleteQueue(interaction.guild);
      throw new CommandError("Could not join your voice channel!");
    }

    return queue;
  };

  static addToQueue = async (
    queue: Queue<{
      channel: TextBasedChannel;
      guild: Guild;
      member: GuildMember | (APIInteractionGuildMember & GuildMember);
    }>,
    searchResult: PlayerSearchResult,
    playOnTop: boolean,
    interaction: GuardedChatInputCommandInteraction,
    guild: IGuild
  ) => {
    let toPlay: Track | Playlist;
    let duration = 0;
    if (searchResult.playlist) {
      if (playOnTop) {
        searchResult.tracks.reverse().forEach((track) => {
          queue.insert(track, 0);
        });
      } else {
        queue.addTracks(searchResult.tracks);
      }
      toPlay = searchResult.playlist;
      toPlay.thumbnail = searchResult.playlist.thumbnail;
      for (const track of searchResult.tracks) {
        duration += track.durationMS;
      }
    } else {
      if (playOnTop) {
        queue.insert(searchResult.tracks[0], 0);
      } else {
        queue.addTrack(searchResult.tracks[0]);
      }
      toPlay = searchResult.tracks[0];
    }

    const embed = new EmbedFactory()
      .setColor(Colors.Green)
      .setTitle(
        `🎶 | Added ${searchResult.playlist ? "Playlist" : "Song"} ${
          playOnTop ? "on top of" : "to"
        } the Queue`
      )
      .setThumbnail(toPlay.thumbnail)
      .setDescription(`**[${toPlay.title}](${toPlay.url})**`)
      .addFields(
        { name: "Titel", value: toPlay.title, inline: true },
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
      .setMemberFooter(interaction.member)
      .create();

    if (!queue.playing) await queue.play();
    queue.setVolume(guild.volume);

    await interaction.editReply({ embeds: [embed] });
  };
}
