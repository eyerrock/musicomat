import { EmbedBuilder, EmbedFooterOptions, GuildMember } from "discord.js";

export class EmbedFactory extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
  }

  public setMemberFooter(member: GuildMember): this {
    return this.setFooter({
      text: `requested by ${member.displayName}`,
      iconURL: member.displayAvatarURL(),
    } as EmbedFooterOptions);
  }
}
