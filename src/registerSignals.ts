import { Client } from "./types/Client";

export const registerSignals = (client: Client) => {
  process.on("SIGINT", async () => {
    console.log("SIGINT signal received. Performing shutdown ...");
    await client.shutdown();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received. Performing shutdown ...");
    await client.shutdown();
    process.exit(0);
  });
};
