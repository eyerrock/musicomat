import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import ora, { Ora } from "ora";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { APICommandRegistrationResponse } from "./types/API.js";
import { Client } from "./types/Client.js";
import { Command } from "./types/Command.js";

const loadCommands = async (client: Client, spinner: Ora) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filesPath = join(__dirname, "commands");

  let commandFiles: string[] = [];
  if (process.env.NODE_ENV === "development") {
    commandFiles = readdirSync(filesPath);
  } else {
    commandFiles = readdirSync(filesPath).filter((file) =>
      file.endsWith(".js")
    );
  }

  const aliases: string[] = [];

  for (const file of commandFiles) {
    spinner.text = `Loading commands ... ${file}`;
    const filePath = join("file://", filesPath, file);
    const { default: command }: { default: Command } = await import(filePath);

    client.slashCommands.set(command.data.name, command);
    client.slashCommandsData.set(command.data.name, command.data.toJSON());

    if (command.aliases) {
      for (const alias of command.aliases) {
        if (aliases.includes(alias)) {
          throw new Error(`Found duplicate alias: "${alias}" in "${file}"`);
        }
        aliases.push(alias);
        client.slashCommandsData.set(alias, {
          ...command.data.toJSON(),
          name: alias,
        });
      }
    }
  }
};

export const registerCommands = async (client: Client) => {
  const spinner = ora().start("Loading commands ...");

  try {
    await loadCommands(client, spinner);
  } catch (err) {
    spinner.fail("Failed to load application (/) commands!");
    throw err;
  }

  try {
    const rest = new REST({ version: "10" }).setToken(client.config.token);

    spinner.text = `Starting registration of ${client.slashCommandsData.size} application (/) commands ...`;

    const res = (await rest.put(Routes.applicationCommands(client.config.id), {
      body: [...client.slashCommandsData.values()],
    })) as APICommandRegistrationResponse[];

    spinner.succeed(
      `Successfully registered ${res.length} application (/) commands!`
    );
  } catch (err) {
    spinner.fail(
      "Failed to register application (/) commands against Discord API!"
    );
    throw err;
  }
};
