import chalk from "chalk";

import { Client } from "../../types/Client.js";
import { ClientEvent } from "../../types/Event.js";

export default {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    if (!client.user || !client.application) {
      return console.log(`\n${chalk.red("✖")} Client user is null`);
    }

    await client.connectDB();

    console.log(
      `\n${chalk.green("✔")} Logged into: ${chalk.cyan(client.user.tag)}\n`
    );
  },
} as ClientEvent;
