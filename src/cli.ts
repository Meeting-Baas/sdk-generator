#!/usr/bin/env node
// CLI tool for the Meeting Tools SDK

import { SDK_VERSION } from "./index";

const args = process.argv.slice(2);
const command = args[0];

// Display help information
function showHelp() {
  console.log(`Meeting Tools SDK CLI v${SDK_VERSION}`);
  console.log("\nUsage:");
  console.log("  meeting-tools <command> [options]");
  console.log("\nCommands:");
  console.log("  version                 Show version information");
  console.log("  help                    Show this help message");
  console.log("  join-meeting            Join a meeting with a bot");
  console.log("  register-mpc-tools      Register MPC tools with a server");
  console.log("\nFor more information, see the documentation at:");
  console.log("  https://github.com/your-org/meeting-tools-sdk");
}

// Display version information
function showVersion() {
  console.log(`Meeting Tools SDK CLI v${SDK_VERSION}`);
}

// Process the command
async function run() {
  try {
    switch (command) {
      case "version":
        showVersion();
        break;
      case "help":
        showHelp();
        break;
      case undefined:
        showHelp();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.log(
          'Run "meeting-tools help" for a list of available commands.'
        );
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the CLI
run().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
