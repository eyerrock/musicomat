import "dotenv/config.js";

import { GatewayIntentBits } from "discord.js";

import { registerEvents } from "./events/registerEvents.js";
import { registerPlayerEvents } from "./events/registerPlayerEvents.js";
import { registerCommands } from "./registerCommands.js";
import { Client } from "./types/Client.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

await registerEvents(client);
await registerPlayerEvents(client);

await registerCommands(client);

await client.login(process.env.CLIENT_TOKEN);
