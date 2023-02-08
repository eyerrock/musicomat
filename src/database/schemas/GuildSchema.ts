import { model, Schema } from "mongoose";

import { IGuild } from "../interfaces/IGuild.js";

const GuildSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true },
    volume: { type: Number, required: true, default: 100, min: 0, max: 100 },
    onEndDelay: { type: Number, required: true, default: 0, min: 0 },
    onEmptyDelay: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const Guild = model<IGuild>("Guild", GuildSchema);
