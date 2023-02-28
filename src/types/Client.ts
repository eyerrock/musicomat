import chalk from "chalk";
import { Player } from "discord-player";
import {
  Client as ClientJS,
  ClientOptions,
  Collection,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import mongoose from "mongoose";
import ora from "ora";

import { Command } from "./Command";

export class Client extends ClientJS {
  public config: ClientConfiguration;
  public player: Player;
  public slashCommands: Collection<string, Command>;
  public slashCommandsData: Collection<
    string,
    RESTPostAPIChatInputApplicationCommandsJSONBody
  >;
  public db: typeof mongoose;

  constructor(options: ClientOptions) {
    super(options);
    this.config = this.initializeConfig();
    this.player = new Player(this);
    this.slashCommands = new Collection();
    this.slashCommandsData = new Collection();
    this.db = mongoose;
  }

  private initializeConfig = (): ClientConfiguration => {
    const spinner = ora("Loading configuration ...").start();

    const missingEnvVars = [
      "CLIENT_TOKEN",
      "CLIENT_ID",
      "MONGO_URI",
      "W2G_API_KEY",
    ].filter((envVar) => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      spinner.fail(
        `Failed to load configuration! Missing environment variables: ${chalk.cyan(
          missingEnvVars.join(", ")
        )}`
      );
      process.exit(1);
    }

    spinner.succeed("Successfully loaded configuration!");

    return {
      token: String(process.env.CLIENT_TOKEN),
      id: String(process.env.CLIENT_ID),
      mongoURI: String(process.env.MONGO_URI),
      w2gApiKey: String(process.env.WATCH2GETHER_API_KEY),
    };
  };

  public connectDB = async () => {
    const spinner = ora("Connecting to MongoDB ...").start();

    try {
      this.db.set("strictQuery", true);
      await this.db.connect(this.config.mongoURI, {
        dbName: "musicomat",
      });
    } catch (err) {
      spinner.fail(`Failed to connect to MongoDB! Error:\n${err}`);
      process.exit(1);
    }

    spinner.succeed("Successfully connected to MongoDB!");
  };

  public shutdown = async () => {
    const spinner = ora("Client is shutting down ...").start();

    try {
      await this.db.disconnect();
      spinner.text = "Disconnected from MongoDB!";
    } catch (err) {
      spinner.fail("Failed to disconnect from MongoDB!");
      throw err;
    }

    this.destroy();
    spinner.succeed("Successfully destroyed client!");
  };
}

type ClientConfiguration = {
  token: string;
  id: string;
  mongoURI: string;
  w2gApiKey: string;
};
