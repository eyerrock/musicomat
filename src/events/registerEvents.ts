import { readdirSync } from "fs";
import ora from "ora";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { Client } from "../types/Client.js";
import { ClientEvent } from "../types/Event";

export const registerEvents = async (client: Client) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  await register(client, join(__dirname, "client"));
};

const register = async (client: Client, dir: string) => {
  const spinner = ora().start("Loading client-side events ...");

  try {
    let eventFiles: string[] = [];
    if (process.env.NODE_ENV === "development") {
      eventFiles = readdirSync(dir);
    } else {
      eventFiles = readdirSync(dir).filter((file) => file.endsWith(".js"));
    }

    for (const file of eventFiles) {
      spinner.text = `Loading client-side events ... ${file}`;
      const filePath = join("file://", dir, file);
      const { default: event }: { default: ClientEvent } = await import(
        filePath
      );

      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
      }
    }

    spinner.succeed(
      `Successfully loaded ${eventFiles.length} client-side events!`
    );
  } catch (err) {
    spinner.fail("Failed to load client-side events!");
  }
};
