import { ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";

import { CommandError } from "../types/Command.js";

export type GuardedChatInputCommandInteraction = ChatInputCommandInteraction & {
  guild: Guild;
  member: GuildMember;
};

export abstract class CommandGuard {
  public static checkInteraction(
    interaction: ChatInputCommandInteraction
  ): interaction is GuardedChatInputCommandInteraction {
    if (!interaction.guild)
      throw new CommandError("Guild not defined for this interaction.");
    if (!(interaction.member instanceof GuildMember))
      throw new CommandError("Member is not an instance of GuildMember.");
    return true;
  }
}
