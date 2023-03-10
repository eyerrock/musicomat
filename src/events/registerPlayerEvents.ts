import { Player } from "discord-player";
import { readdirSync } from "fs";
import ora from "ora";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { Client } from "../types/Client.js";
import { PlayerEvent } from "../types/Event.js";

export const registerPlayerEvents = async (client: Client) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  await register(client, join(__dirname, "player"));
};

const register = async (client: Client, dir: string) => {
  const spinner = ora().start("Loading player-side events ...");

  try {
    let eventFiles: string[] = [];
    if (process.env.NODE_ENV === "development") {
      eventFiles = readdirSync(dir);
    } else {
      eventFiles = readdirSync(dir).filter((file) => file.endsWith(".js"));
    }

    for (const file of eventFiles) {
      spinner.text = `Loading player-side events ... ${file}`;
      const filePath = join("file://", dir, file);
      const { default: event }: { default: PlayerEvent } = await import(
        filePath
      );
      if (event.once) {
        Player.singleton(client).events.once(
          event.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async (...args: any) =>
            await event.execute(Player.singleton(client), ...args)
        );
      } else {
        Player.singleton(client).events.on(
          event.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async (...args: any) =>
            await event.execute(Player.singleton(client), ...args)
        );
      }
    }

    spinner.succeed(
      `Successfully loaded ${eventFiles.length} player-side events!`
    );
  } catch (err) {
    spinner.fail("Failed to load player-side events!");
  }
};
