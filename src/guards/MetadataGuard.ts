import { Queue } from "discord-player";

import { Metadata } from "../types/QueueController.js";

export abstract class MetadataGuard {
  public static guardMetadata = (
    queue: Queue<unknown>
  ): queue is Queue<Metadata> & { metadata: Metadata } => {
    return (
      queue.metadata !== undefined &&
      queue.metadata !== null &&
      typeof queue.metadata === "object" &&
      "channel" in queue.metadata &&
      "guild" in queue.metadata &&
      "member" in queue.metadata
    );
  };
}
