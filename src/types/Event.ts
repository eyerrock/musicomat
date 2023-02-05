import { Player, PlayerEvents } from "discord-player";

import { Client } from "./Client.js";

export type ClientEvent = {
  name: string;
  once: boolean;
  execute: (client?: Client, ...args: unknown[]) => void;
};

export type PlayerEvent = {
  name: keyof PlayerEvents;
  once: boolean;
  execute: (player?: Player, ...args: unknown[]) => Promise<void>;
};
