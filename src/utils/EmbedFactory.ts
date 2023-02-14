import {
  APIEmbedField,
  ColorResolvable,
  EmbedBuilder,
  EmbedFooterOptions,
  GuildMember,
} from "discord.js";

export class EmbedFactory {
  private title: string;
  private description: string;
  private color: ColorResolvable;
  private fields: APIEmbedField[];
  private member: GuildMember | null;
  private footer: EmbedFooterOptions | null;
  private thumbnail: string | null;
  private url: string | null;

  constructor() {
    this.title = "";
    this.description = "";
    this.color = "Default";
    this.fields = [];
    this.member = null;
    this.footer = null;
    this.thumbnail = null;
    this.url = null;
  }

  public setTitle(title: string) {
    this.title = title;
    return this;
  }

  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  public setColor(color: ColorResolvable) {
    this.color = color;
    return this;
  }

  public addFields(...fields: APIEmbedField[]) {
    this.fields = fields;
    return this;
  }

  public setMemberFooter(member: GuildMember) {
    this.footer = null;
    this.member = member;
    return this;
  }

  public setFooter(footer: EmbedFooterOptions) {
    this.member = null;
    this.footer = footer;
    return this;
  }

  public setThumbnail(thumbnail: string) {
    this.thumbnail = thumbnail;
    return this;
  }

  public setURL(url: string) {
    this.url = url;
    return this;
  }

  public create() {
    return new EmbedBuilder()
      .setColor(this.color)
      .setTitle(this.title)
      .setURL(this.url)
      .setThumbnail(this.thumbnail ?? null)
      .setDescription(this.description)
      .addFields(this.fields)
      .setTimestamp()
      .setFooter(
        this.member
          ? {
              text: `requested by ${this.member.displayName}`,
              iconURL: this.member.displayAvatarURL(),
            }
          : this.footer ?? null
      );
  }
}
