import { ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";

import { CommandError } from "../types/Command.js";

export abstract class CommandGuard {
  public static checkInteraction(
    interaction: ChatInputCommandInteraction
  ): interaction is ChatInputCommandInteraction & {
    member: GuildMember;
    guild: Guild;
  } {
    if (!interaction.guild)
      throw new CommandError("Guild not defined for this interaction.");
    if (!(interaction.member instanceof GuildMember))
      throw new CommandError("Member is not an instance of GuildMember.");
    return true;
  }
}
