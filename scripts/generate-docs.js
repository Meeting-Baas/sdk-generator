#!/usr/bin/env node
/**
 * Documentation Generator
 *
 * This script automatically generates documentation by analyzing the generated OpenAPI client.
 */

const fs = require("fs");
const path = require("path");

// Paths
const GENERATED_DIR = path.resolve(__dirname, "../src/generated/baas/api");
const README_FILE = path.resolve(__dirname, "../README.md");
const DOCS_START_MARKER = "## Available Methods";
const DOCS_END_MARKER = "## About Meeting BaaS";

function cleanDescription(desc) {
  // Remove OpenAPI generator comments and internal details
  return desc
    .replace(/Meeting BaaS API.*?Do not edit the class manually\.\s*/s, "")
    .replace(/\s*@ts-ignore.*$/gm, "")
    .replace(/\s*import.*$/gm, "")
    .replace(/\s*\/\*\s*\*\//g, "")
    .replace(/\s*\/\s*/g, "")
    .replace(/\s+/g, " ")
    .replace(/\* /g, "") // Remove asterisks from JSDoc
    .replace(/\*Some\*\*/g, "") // Remove some artifacts
    .replace(/- axios parameter creator/g, "")
    .replace(/- functional programming interface/g, "")
    .replace(/- factory interface/g, "")
    .replace(/@summary\s+/g, "") // Remove @summary tags
    .replace(/@param\s+\{[^}]+\}\s*/g, "") // Remove param type definitions
    .replace(/\s+@throws.*$/gm, "") // Remove throws annotations
    .replace(/\s+@export.*$/gm, "") // Remove export annotations
    .trim();
}

function extractMethodsFromApi(apiFile) {
  const content = fs.readFileSync(apiFile, "utf8");
  const methods = [];

  // Match method declarations with JSDoc comments and TypeScript types
  const methodRegex =
    /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(?:async\s+)?(\w+)\s*\(([\s\S]*?)\).*?Promise<([^>]+)>/g;
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    const [_, docComment, methodName, params, returnType] = match;

    // Extract description from JSDoc
    const description = cleanDescription(docComment);

    // Extract parameters with their actual types
    const parameters = params
      .split(",")
      .map((param) => param.trim())
      .filter((param) => param && !param.includes("options")) // Filter out options parameter
      .map((param) => {
        const [name, type] = param.split(":").map((p) => p.trim());
        // Clean up the type by removing any TypeScript utility types
        const cleanType =
          type
            ?.replace(/\s*\|\s*null/g, "?")
            ?.replace(/\s*\|\s*undefined/g, "?")
            ?.replace(/Promise<(.+)>/, "$1") || "any";
        return { name, type: cleanType };
      });

    if (description && !methodName.startsWith("_")) {
      methods.push({
        name: methodName,
        description: description.split(". ")[0], // Take only the first sentence for brevity
        parameters,
        returnType: returnType.replace(/AxiosPromise<(.+)>/, "$1"),
      });
    }
  }

  return methods;
}

function generateMethodsTable(methods) {
  let table = "## Available Methods\n\n";
  table +=
    "The SDK provides a simple interface for interacting with Meeting BaaS. Initialize the client with your API key:\n\n";
  table += "```typescript\n";
  table += 'import { BaasClient } from "@meeting-baas/sdk";\n\n';
  table += "const client = new BaasClient({\n";
  table += '  apiKey: "your-api-key"\n';
  table += "});\n```\n\n";

  // Group methods by API category
  const groupedMethods = methods.reduce((acc, method) => {
    const [category] = method.name.split(".");
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(method);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedMethods).sort();

  sortedCategories.forEach((category) => {
    if (category === "default") return;

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    table += `### ${categoryName} API\n\n`;

    // Sort methods within category
    const categoryMethods = groupedMethods[category].sort((a, b) =>
      a.name.split(".")[1].localeCompare(b.name.split(".")[1])
    );

    categoryMethods.forEach((method) => {
      if (
        method.name.includes("factory interface") ||
        method.name.includes("parameter creator")
      ) {
        return;
      }

      const methodName = method.name.split(".")[1];

      // Format parameters with their types
      const params = method.parameters
        .map((p) => `${p.name}: ${p.type}`)
        .join(", ");

      // Add method signature with description
      table += `#### \`${methodName}(${params})\`\n\n`;
      table += `${method.description}\n\n`;

      // Add example usage with proper types
      if (method.parameters.length > 0) {
        table += "<details>\n<summary>Example</summary>\n\n";
        table += "```typescript\n";
        // Add type imports if needed
        const types = method.parameters
          .map((p) => p.type.replace(/\?$/, ""))
          .filter((type) => !["string", "number", "boolean"].includes(type));
        if (types.length > 0) {
          table += `import { ${types.join(
            ", "
          )} } from "@meeting-baas/sdk";\n\n`;
        }
        // Add example code
        table += `// Returns: Promise<${method.returnType}>\n`;
        table += `await client.${category}.${methodName}(${method.parameters
          .map((p) => {
            const type = p.type.replace(/\?$/, "");
            if (type === "string") return "'example'";
            if (type === "number") return "123";
            if (type === "boolean") return "true";
            return `{
  // ... ${type} properties
}`;
          })
          .join(", ")});\n`;
        table += "```\n</details>\n\n";
      }
    });
  });

  return table;
}

function updateReadme(methodsTable) {
  let content = fs.readFileSync(README_FILE, "utf8");

  // Find the section to replace
  const startIndex = content.indexOf(DOCS_START_MARKER);
  const endIndex = content.indexOf(DOCS_END_MARKER);

  if (startIndex === -1) {
    // Section doesn't exist, add it before "About Meeting BaaS"
    const aboutIndex = content.indexOf("## About Meeting BaaS");
    content =
      content.slice(0, aboutIndex) +
      methodsTable +
      "\n" +
      content.slice(aboutIndex);
  } else {
    // Replace existing section
    content =
      content.slice(0, startIndex) + methodsTable + content.slice(endIndex);
  }

  fs.writeFileSync(README_FILE, content);
}

// Main execution
console.log("Generating SDK documentation...");

// Read all API files
const apiFiles = fs
  .readdirSync(GENERATED_DIR)
  .filter((file) => file.endsWith("-api.ts"))
  .map((file) => path.join(GENERATED_DIR, file));

// Extract methods from all API files
const allMethods = apiFiles.reduce((methods, file) => {
  const apiName = path.basename(file, ".ts").replace(/-api$/, "");
  const apiMethods = extractMethodsFromApi(file).map((method) => ({
    ...method,
    name: `${apiName}.${method.name}`,
  }));
  return [...methods, ...apiMethods];
}, []);

// Generate and update documentation
const methodsTable = generateMethodsTable(allMethods);
updateReadme(methodsTable);

console.log("Documentation generated successfully!");
