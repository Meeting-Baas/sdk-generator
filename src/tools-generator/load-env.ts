/**
 * Environment variable loader for tools generator
 *
 * This is only used during development and tool generation,
 * not in the published package during normal SDK usage.
 */

import fs from "fs";
import path from "path";

/**
 * Loads environment variables from a .env file if present
 * Falls back gracefully if no file is found
 */
export function loadEnv(): void {
  try {
    // Look for .env file in project root
    const envPath = path.resolve(process.cwd(), ".env");

    if (fs.existsSync(envPath)) {
      console.log(`Loading environment variables from ${envPath}`);

      const envContents = fs.readFileSync(envPath, "utf-8");
      const envVars = parseEnvFile(envContents);

      // Set environment variables if not already set
      for (const [key, value] of Object.entries(envVars)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } else {
      console.log("No .env file found, using existing environment variables");
    }
  } catch (error) {
    console.warn("Failed to load .env file:", error);
  }
}

/**
 * Simple .env file parser
 */
function parseEnvFile(contents: string): Record<string, string> {
  const result: Record<string, string> = {};

  // Split by lines and process each line
  contents.split("\n").forEach((line) => {
    // Remove comments
    const commentIndex = line.indexOf("#");
    const cleanLine = commentIndex !== -1 ? line.slice(0, commentIndex) : line;

    // Parse VAR=value format
    const match = cleanLine.match(/^\s*([^=\s]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }

      result[key] = value;
    }
  });

  return result;
}
