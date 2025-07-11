import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

async function startServer() {
  try {
    await mongoose.connect(config.database as string);
    server = app.listen(config.port, () => {
      console.log(`Server Runs at PORT:- ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log(`Unhandled Rejection:- ${error}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log(`UnCaught Rejection:- ${error}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log(`SIGNAL TERMINATION`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
