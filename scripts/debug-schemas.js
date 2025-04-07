#!/usr/bin/env node
/**
 * Tool Schema Debug Script
 *
 * This script analyzes the generated tools to identify and debug issues
 * with schema exports and tool types.
 */

const fs = require("fs");
const path = require("path");

console.log("\n🔍 TOOL SCHEMA ANALYSIS\n");

// Paths to analyze
const toolsDirPath = path.resolve(__dirname, "..", "dist/tools");
const toolsJsPath = path.resolve(__dirname, "..", "dist/tools.js");
const indexJsPath = path.join(toolsDirPath, "index.js");

try {
  // Check for existence of key files
  console.log("Checking for key files...");

  if (!fs.existsSync(toolsJsPath)) {
    console.error(`❌ Main tools.js file does not exist at ${toolsJsPath}`);
    process.exit(1);
  }
  console.log(
    `✓ Found main tools.js file (${fs.statSync(toolsJsPath).size} bytes)`
  );

  if (!fs.existsSync(toolsDirPath)) {
    console.error(`❌ Tools directory does not exist at ${toolsDirPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(indexJsPath)) {
    console.error(`❌ tools/index.js file does not exist at ${indexJsPath}`);
    process.exit(1);
  }
  console.log(
    `✓ Found tools/index.js file (${fs.statSync(indexJsPath).size} bytes)`
  );

  // Load and analyze the main tools.js export
  console.log("\n📦 ANALYZING MAIN TOOLS.JS EXPORTS");
  const toolsExport = require(toolsJsPath);
  console.log(`Found ${Object.keys(toolsExport).length} exports in tools.js`);

  // Look for schema exports
  const schemaExports = Object.keys(toolsExport).filter(
    (key) =>
      key.endsWith("Schema") || key === "ToolParameters" || key === "ToolSchema"
  );

  if (schemaExports.length > 0) {
    console.log(`Found ${schemaExports.length} schema-related exports:`);
    schemaExports.forEach((key) => console.log(`- ${key}`));
  } else {
    console.warn("⚠️ No schema-related exports found in tools.js");
  }

  // Load and analyze the tools/index.js file
  console.log("\n📦 ANALYZING TOOLS/INDEX.JS EXPORTS");
  const toolsIndexExport = require(indexJsPath);
  console.log(
    `Found ${Object.keys(toolsIndexExport).length} exports in tools/index.js`
  );

  // Look for schema exports in tools/index.js
  const indexSchemaExports = Object.keys(toolsIndexExport).filter(
    (key) =>
      key.endsWith("Schema") || key === "ToolParameters" || key === "ToolSchema"
  );

  if (indexSchemaExports.length > 0) {
    console.log(
      `Found ${indexSchemaExports.length} schema-related exports in tools/index.js:`
    );
    indexSchemaExports.forEach((key) => console.log(`- ${key}`));

    // Identify missing exports that are in index.js but not in tools.js
    const missingExports = indexSchemaExports.filter(
      (key) => !schemaExports.includes(key)
    );
    if (missingExports.length > 0) {
      console.warn("\n⚠️ MISSING SCHEMA EXPORTS");
      console.warn(
        "The following schemas are exported from tools/index.js but not from tools.js:"
      );
      missingExports.forEach((key) => console.warn(`- ${key}`));
      console.warn(
        "\nThis indicates a re-export issue in the main tools.js file."
      );
    }
  } else {
    console.warn("⚠️ No schema-related exports found in tools/index.js");
  }

  // Check individual tool files for schemas
  console.log("\n📁 ANALYZING INDIVIDUAL TOOL FILES");
  const toolFiles = fs
    .readdirSync(toolsDirPath)
    .filter((file) => file !== "index.js" && file.endsWith(".js"));

  console.log(`Found ${toolFiles.length} individual tool files`);

  // Sample the first few tool files to check for schema patterns
  const sampleFiles = toolFiles.slice(0, Math.min(3, toolFiles.length));

  for (const file of sampleFiles) {
    console.log(`\nAnalyzing sample tool file: ${file}`);
    const filePath = path.join(toolsDirPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Look for schema definitions in the file
    const schemaDefMatches =
      fileContent.match(/(?:const|var|let)\s+(\w+Schema)\s*=/g) || [];
    if (schemaDefMatches.length > 0) {
      console.log(`Found ${schemaDefMatches.length} schema definitions:`);
      schemaDefMatches.forEach((match) => {
        console.log(`- ${match.trim()}`);
      });
    } else {
      console.log("No schema definitions found in this file");
    }

    // Look for schema exports in the file
    const schemaExportMatches =
      fileContent.match(/exports\.(\w+Schema)\s*=/g) || [];
    if (schemaExportMatches.length > 0) {
      console.log(`Found ${schemaExportMatches.length} schema exports:`);
      schemaExportMatches.forEach((match) => {
        console.log(`- ${match.trim()}`);
      });
    } else {
      console.log("No schema exports found in this file");
    }

    // Check for Zod imports
    if (fileContent.includes("zod")) {
      console.log("This file contains references to 'zod'");

      // Look for Zod schema patterns
      const zodPatterns = [
        "z.object",
        "z.string",
        "z.number",
        "z.boolean",
        "z.array",
      ];

      const foundZodPatterns = zodPatterns.filter((pattern) =>
        fileContent.includes(pattern)
      );
      if (foundZodPatterns.length > 0) {
        console.log("Found common Zod schema patterns:");
        foundZodPatterns.forEach((pattern) => console.log(`- ${pattern}`));
      }
    }
  }

  console.log("\n✅ Schema analysis complete");

  if (schemaExports.length === 0 && indexSchemaExports.length > 0) {
    console.log("\n🔧 RECOMMENDED FIX:");
    console.log(
      "Run the schema export fix script to re-export schemas from tools/index.js:"
    );
    console.log("node scripts/fix-tools-export.js --failsafe");
  }
} catch (error) {
  console.error("\n❌ Error analyzing schemas:", error);
  process.exit(1);
}
