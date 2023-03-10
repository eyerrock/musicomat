import { GuildQueue } from "discord-player";

import { Metadata } from "../helpers/QueueController.js";

export abstract class MetadataGuard {
  public static guardMetadata = (
    queue: GuildQueue<unknown>
  ): queue is GuildQueue<Metadata> & { metadata: Metadata } => {
    return (
      queue.metadata !== undefined &&
      queue.metadata !== null &&
      typeof queue.metadata === "object" &&
      "channel" in queue.metadata &&
      "guild" in queue.metadata &&
      "guildData" in queue.metadata &&
      "member" in queue.metadata &&
      "destroyed" in queue.metadata
    );
  };
}
