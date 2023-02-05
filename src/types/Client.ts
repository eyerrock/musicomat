import { Player } from "discord-player";
import { Client as ClientJS, ClientOptions, Collection } from "discord.js";

import { Command } from "./Command";

export class Client extends ClientJS {
  public player: Player;
  public slashCommands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.player = new Player(this);
    this.slashCommands = new Collection();
  }
}
