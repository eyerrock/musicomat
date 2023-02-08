import { IGuild } from "../interfaces/IGuild.js";
import { Guild } from "../schemas/GuildSchema.js";

export abstract class GuildController {
  private static _validateData(data: IGuild): void {
    if (data.volume < 0 || data.volume > 100)
      throw new Error("Volume must be between 0 and 100.");
    if (data.onEndDelay < 0) throw new Error("onEndDelay must be positive.");
    if (data.onEmptyDelay < 0)
      throw new Error("onEmptyDelay must be positive.");
  }

  public static async getGuild(guildId: string): Promise<IGuild | null> {
    return Guild.findOne({ guildId });
  }

  public static async createGuild(guildId: string): Promise<IGuild> {
    const guild = new Guild({ guildId });
    await guild.save();
    return guild;
  }

  public static async updateGuild(
    guildId: string,
    data: IGuild
  ): Promise<IGuild> {
    const guild = await Guild.findOne({ guildId });
    if (!guild) throw new Error("Guild not found.");
    this._validateData(data);
    guild.set(data);
    await guild.save();
    return guild;
  }

  public static async deleteGuild(guildId: string): Promise<void> {
    await Guild.findByIdAndDelete(guildId);
  }

  public static async findOneOrCreateGuild(guildId: string): Promise<IGuild> {
    const guild = await this.getGuild(guildId);
    if (guild) return guild;
    return await this.createGuild(guildId);
  }
}
