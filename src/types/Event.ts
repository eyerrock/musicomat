import { GuildQueueEvents, Player } from "discord-player";
import { ClientEvents } from "discord.js";

import { Client } from "./Client.js";

export type ClientEvent = {
  name: keyof ClientEvents;
  once: boolean;
  execute: (client?: Client, ...args: unknown[]) => void;
};

export type PlayerEvent = {
  name: keyof GuildQueueEvents;
  once: boolean;
  execute: (player?: Player, ...args: unknown[]) => Promise<void>;
};
