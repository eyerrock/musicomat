import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import { IGuild } from "../database/interfaces/IGuild.js";
import { GuardedChatInputCommandInteraction } from "../guards/CommandGuard.js";
import { Client } from "./Client.js";

export type Command = {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  aliases?: string[];
  execute: (
    interaction: GuardedChatInputCommandInteraction,
    guild: IGuild,
    client: Client
  ) => Promise<CommandError | void>;
};

export class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandError";
  }
}
