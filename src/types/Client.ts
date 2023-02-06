import { Player } from "discord-player";
import { Client as ClientJS, ClientOptions, Collection } from "discord.js";
import mongoose from "mongoose";
import ora from "ora";

import { Command } from "./Command";

export class Client extends ClientJS {
  public config: ClientConfiguration;
  public player: Player;
  public slashCommands: Collection<string, Command>;
  public db: typeof mongoose;

  constructor(options: ClientOptions) {
    super(options);
    this.config = this.initializeConfig();
    this.player = new Player(this);
    this.slashCommands = new Collection();
    this.db = mongoose;
  }

  private initializeConfig = (): ClientConfiguration => {
    const spinner = ora("Loading configuration ...").start();

    if (!process.env.CLIENT_TOKEN) {
      spinner.fail("Missing CLIENT_TOKEN environment variable!");
      process.exit(1);
    } else if (!process.env.CLIENT_ID) {
      spinner.fail("Missing CLIENT_ID environment variable!");
      process.exit(1);
    } else if (!process.env.MONGO_URI) {
      spinner.fail("Missing MONGO_URI environment variable!");
      process.exit(1);
    }

    spinner.succeed("Successfully loaded configuration!");

    return {
      token: String(process.env.CLIENT_TOKEN),
      id: String(process.env.CLIENT_ID),
      mongoURI: String(process.env.MONGO_URI),
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
      spinner.fail("Failed to connect to MongoDB!");
      throw err;
    }

    spinner.succeed("Successfully connected to MongoDB!");
  };

  public shutdown = async () => {
    const spinner = ora("Client is shutting down ...").start();

    try {
      await this.db.disconnect();
      spinner.text = "Successfully disconnected from MongoDB!";
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
};
