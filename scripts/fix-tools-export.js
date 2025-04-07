#!/usr/bin/env node
/**
 * Fix Tools Export Script
 *
 * This script fixes the issue with the allTools array not being properly
 * exported from the main tools.js file.
 */

const fs = require("fs");
const path = require("path");

console.log("Running tools export fix script...");

// Path to the main tools.js file
const toolsJsPath = path.resolve(__dirname, "..", "dist", "tools.js");

// Path to the tools/index.js file
const toolsIndexPath = path.resolve(
  __dirname,
  "..",
  "dist",
  "tools",
  "index.js"
);

// Check if files exist
if (!fs.existsSync(toolsJsPath)) {
  console.error(`Error: Main tools.js file not found at ${toolsJsPath}`);
  process.exit(1);
}

if (!fs.existsSync(toolsIndexPath)) {
  console.error(`Error: Tools index.js file not found at ${toolsIndexPath}`);
  process.exit(1);
}

try {
  // Read the current content of the files
  const toolsJsContent = fs.readFileSync(toolsJsPath, "utf8");
  console.log(`Read ${toolsJsPath} (${toolsJsContent.length} bytes)`);

  // Also read the index.js file to see how allTools is defined
  const indexJsContent = fs.readFileSync(toolsIndexPath, "utf8");
  console.log(`Read ${toolsIndexPath} (${indexJsContent.length} bytes)`);

  // Print out portions of index.js related to allTools
  const allToolsIdx = indexJsContent.indexOf("allTools");
  if (allToolsIdx !== -1) {
    console.log("\n=== SHOWING CONTENT AROUND allTools IN index.js ===");
    const startIdx = Math.max(0, allToolsIdx - 200);
    const endIdx = Math.min(indexJsContent.length, allToolsIdx + 500);
    console.log(indexJsContent.substring(startIdx, endIdx));
    console.log("=== END OF CONTENT ===\n");

    // Try to extract tool names directly from the file
    try {
      // Look for the allTools array
      const arrayMatch = indexJsContent.match(
        /exports\.allTools\s*=\s*\[\s*([\s\S]*?)\s*\]/
      );
      if (arrayMatch && arrayMatch[1]) {
        console.log("\n=== ANALYZING TOOL ENTRIES ===");
        const toolEntries = arrayMatch[1]
          .split(",")
          .map((entry) => entry.trim());
        console.log(
          `Found ${toolEntries.length} entries in the allTools array`
        );

        // Extract tool names
        const toolNamePattern = /name:\s*['"]([^'"]+)['"]/;
        const toolNames = toolEntries
          .map((entry) => {
            const match = entry.match(toolNamePattern);
            return match ? match[1] : null;
          })
          .filter(Boolean);

        if (toolNames.length > 0) {
          console.log(`Extracted ${toolNames.length} tool names:`);
          toolNames.forEach((name) => console.log(`- ${name}`));
        } else {
          console.log("Could not extract tool names from the array entries");
        }
        console.log("=== END OF TOOL ANALYSIS ===\n");
      }
    } catch (error) {
      console.log("Error analyzing tools:", error.message);
    }
  } else {
    console.log("Could not find 'allTools' in index.js!");
  }

  // Also look for common export patterns
  console.log("\n=== EXPORT PATTERNS IN index.js ===");
  console.log(
    "Contains 'exports.allTools':",
    indexJsContent.includes("exports.allTools")
  );
  console.log(
    "Contains 'module.exports':",
    indexJsContent.includes("module.exports")
  );
  console.log(
    "Contains 'export default':",
    indexJsContent.includes("export default")
  );
  console.log("Contains 'export {':", indexJsContent.includes("export {"));
  console.log("=== END OF EXPORT PATTERNS ===\n");

  // Analyze how tools.js imports from tools/index.js
  console.log("\n=== IMPORT/EXPORT PATTERNS IN tools.js ===");
  console.log(
    "tools.js imports from tools/index:",
    toolsJsContent.includes("require('./tools/index')")
  );

  // Look for specific import patterns
  const importPatterns = [
    "require('./tools/index')",
    "Object.assign(exports, require('./tools/index'))",
    "const tools = require('./tools/index')",
    "var tools = require('./tools/index')",
    "let tools = require('./tools/index')",
    "import * from './tools/index'",
  ];

  importPatterns.forEach((pattern) => {
    console.log(`Contains '${pattern}':`, toolsJsContent.includes(pattern));
  });

  // Look for current exports in tools.js
  console.log("\nCurrent exports in tools.js:");
  const exportMatches = toolsJsContent.match(/exports\.(\w+)\s*=/g) || [];
  exportMatches.forEach((match) => {
    console.log(`- ${match.trim()}`);
  });

  // Look for schema exports specifically
  console.log("\nLooking for schema exports in index.js:");
  const schemaMatches = indexJsContent.match(/exports\.(\w+Schema)\s*=/g) || [];
  if (schemaMatches.length > 0) {
    console.log("Found schema exports in index.js:");
    schemaMatches.forEach((match) => {
      const schemaName = match.match(/exports\.(\w+)\s*=/)[1];
      console.log(`- ${schemaName}`);
    });
  } else {
    console.log("No schema exports found in index.js");
  }

  // Look for Zod imports or references
  if (indexJsContent.includes("zod")) {
    console.log("Found references to 'zod' in index.js");
  }

  // Check for type exports
  const typeExportMatches =
    indexJsContent.match(/export\s+type\s+(\w+)/g) || [];
  if (typeExportMatches.length > 0) {
    console.log("Found type exports in index.js:");
    typeExportMatches.forEach((match) => {
      console.log(`- ${match}`);
    });
  }

  console.log("=== END OF IMPORT/EXPORT PATTERNS ===\n");

  // Check if allTools is already exported
  if (toolsJsContent.includes("exports.allTools")) {
    console.log("allTools already exported, no fix needed.");
    process.exit(0);
  }

  // Add export for allTools
  let updatedContent;

  // Try to find the import from tools/index
  const requireMatch = toolsJsContent.match(
    /(?:const|var|let)\s+(\w+)\s*=\s*require\(['"]\.\/tools\/index['"]\)/
  );

  if (requireMatch) {
    // We found an import with a variable name, use that to re-export allTools
    const importVar = requireMatch[1];
    console.log(`Found import from tools/index as variable: ${importVar}`);

    // Add the re-export at the end of the file
    updatedContent =
      toolsJsContent +
      `\n\n// Added by fix-tools-export.js\n` +
      `// Re-exporting allTools\n` +
      `exports.allTools = ${importVar}.allTools;\n` +
      `// Re-exporting allSchemas\n` +
      `exports.allSchemas = ${importVar}.allSchemas;\n` +
      `// Re-exporting getSchemaByName\n` +
      `exports.getSchemaByName = ${importVar}.getSchemaByName;\n\n` +
      `// Re-exporting any schemas that might exist\n` +
      `// Common schema naming patterns\n` +
      `for (const key in ${importVar}) {\n` +
      `  // Export anything that looks like a schema (ends with Schema)\n` +
      `  if (key.endsWith('Schema')) {\n` +
      `    exports[key] = ${importVar}[key];\n` +
      `    console.log('Re-exported schema: ' + key);\n` +
      `  }\n` +
      `  // Also export any types\n` +
      `  if (key === 'ToolParameters' || key === 'ToolSchema') {\n` +
      `    exports[key] = ${importVar}[key];\n` +
      `    console.log('Re-exported type: ' + key);\n` +
      `  }\n` +
      `}\n`;
  } else {
    // We didn't find a clean import, so add a new one
    console.log("No import from tools/index found, adding a new one");

    // Add a new import and export at the end of the file
    updatedContent =
      toolsJsContent +
      `
// Added by fix-tools-export.js
const toolsIndex = require('./tools/index');
exports.allTools = toolsIndex.allTools;
exports.allSchemas = toolsIndex.allSchemas;
exports.getSchemaByName = toolsIndex.getSchemaByName;

// Re-export any schemas that might exist
for (const key in toolsIndex) {
  // Export anything that looks like a schema (ends with Schema)
  if (key.endsWith('Schema')) {
    exports[key] = toolsIndex[key];
    console.log('Re-exported schema: ' + key);
  }
  // Also export any types
  if (key === 'ToolParameters' || key === 'ToolSchema') {
    exports[key] = toolsIndex[key];
    console.log('Re-exported type: ' + key);
  }
}
`;
  }

  // Write the updated content
  fs.writeFileSync(toolsJsPath, updatedContent);
  console.log(`✅ Successfully updated ${toolsJsPath} to export allTools`);

  // Create a failsafe fix version if requested
  if (process.argv.includes("--failsafe")) {
    console.log("\nApplying failsafe fix...");

    // Create an updated version with hardcoded additions
    const failsafeAddition = `
//===== BEGINNING OF FAILSAFE FIX =====
// This code was added by fix-tools-export.js with --failsafe
// It directly adds the allTools export without trying to modify existing code

// Direct import from tools/index.js
try {
  const toolsIndex = require('./tools/index.js');
  
  // Export allTools if it exists in toolsIndex
  if (toolsIndex && toolsIndex.allTools) {
    exports.allTools = toolsIndex.allTools;
    console.log('Successfully exported allTools from tools/index.js');
    
    // Also export any schemas that might exist
    for (const key in toolsIndex) {
      // Export anything that looks like a schema (ends with Schema)
      if (key.endsWith('Schema')) {
        exports[key] = toolsIndex[key];
        console.log('Re-exported schema: ' + key);
      }
      // Also export any types
      if (key === 'ToolParameters' || key === 'ToolSchema') {
        exports[key] = toolsIndex[key];
        console.log('Re-exported type: ' + key);
      }
    }
  } else {
    console.error('Failed to find allTools in tools/index.js');
    
    // Create a minimal placeholder if allTools doesn't exist
    exports.allTools = [];
  }
} catch (error) {
  console.error('Error importing tools/index.js:', error.message);
  
  // Create a minimal placeholder if import fails
  exports.allTools = [];
}
//===== END OF FAILSAFE FIX =====
`;

    // Append the failsafe code to the end of the file
    fs.appendFileSync(toolsJsPath, failsafeAddition);
    console.log("✅ Applied failsafe fix to tools.js");
  }
} catch (error) {
  console.error("Error fixing tools export:", error);
  process.exit(1);
}
