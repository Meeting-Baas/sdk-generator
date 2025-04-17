const fs = require("fs");
const path = require("path");

// Function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

// Function to transform property names in an object
function transformProperties(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(transformProperties);
  }

  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    transformed[camelKey] = transformProperties(value);
  }
  return transformed;
}

// Function to transform snake_case to camelCase in a string
function transformSnakeToCamel(content) {
  // Transform property names in interfaces and types
  content = content.replace(/'([a-z_]+)':/g, (match, p1) => {
    const camelCase = toCamelCase(p1);
    return `'${camelCase}':`;
  });

  // Transform property names in object literals
  content = content.replace(/(\w+)_(\w+):/g, (match, p1, p2) => {
    return `${p1}${p2.charAt(0).toUpperCase()}${p2.slice(1)}:`;
  });

  // Transform property access
  content = content.replace(/\.([a-z_]+)/g, (match, p1) => {
    const camelCase = toCamelCase(p1);
    return `.${camelCase}`;
  });

  // Transform type references
  content = content.replace(/type: '([a-z_]+)'/g, (match, p1) => {
    const camelCase = toCamelCase(p1);
    return `type: '${camelCase}'`;
  });

  return content;
}

// Read and transform the generated API files
const apiDir = path.join(__dirname, "../src/generated/baas/api");
const modelDir = path.join(__dirname, "../src/generated/baas/models");
const files = fs.readdirSync(apiDir);

// First pass: collect all API classes
const apiClasses = [];
files.forEach((file) => {
  if (!file.endsWith("-api.ts")) return;
  const className = file
    .replace(".ts", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  apiClasses.push({
    fileName: file,
    className: className,
  });
});

// Transform model files to use camelCase
const modelFiles = fs.readdirSync(modelDir);
modelFiles.forEach((file) => {
  if (!file.endsWith(".ts")) return;

  const filePath = path.join(modelDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  content = transformSnakeToCamel(content);
  fs.writeFileSync(filePath, content);
});

// Transform API files to use camelCase
files.forEach((file) => {
  if (!file.endsWith(".ts")) return;

  const filePath = path.join(apiDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // First fix the constant names in both imports and usage
  content = content.replace(/\bDUMMY_BASEURL\b/g, "DUMMY_BASE_URL");
  content = content.replace(/\bBASEPATH\b/g, "BASE_PATH");
  content = content.replace(/\bBASE_PATH\b/g, "basePath");

  // Fix the function return statements to ensure basePath is always a string
  content = content.replace(
    /return \(axios, basePath\) => createRequestFunction\(([^)]+)\)\(axios, localVarOperationServerBasePath \|\| basePath\)/g,
    "return (axios, basePath = '') => createRequestFunction($1)(axios, localVarOperationServerBasePath || basePath)"
  );

  // Fix parameter types to handle undefined values
  content = content.replace(
    /(?:const|let|var)\s+(\w+)\s*:\s*string\s*\|\s*undefined/g,
    "$1?: string"
  );

  // Add null checks for string parameters
  content = content.replace(
    /(\w+)\s*=\s*(\w+)\s*\|\|\s*undefined/g,
    "$1 = $2 || ''"
  );

  // Fix basePath parameter default value
  content = content.replace(
    /basePath: string = basePath/g,
    "basePath: string = ''"
  );

  // Then transform snake_case to camelCase in method names and parameters
  content = transformSnakeToCamel(content);

  fs.writeFileSync(filePath, content);
});

// Also fix the constant names in base.ts and common.ts
const baseFiles = ["base.ts", "common.ts"];
baseFiles.forEach((file) => {
  const filePath = path.join(__dirname, "../src/generated/baas", file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/\bDUMMY_BASEURL\b/g, "DUMMY_BASE_URL");
    content = content.replace(/\bBASEPATH\b/g, "BASE_PATH");
    content = content.replace(/\bBASE_PATH\b/g, "basePath");

    // Fix the specific circular reference in common.ts
    if (file === "common.ts") {
      content = content.replace(
        /return <T = unknown, R = AxiosResponse<T>>\(axios: AxiosInstance = globalAxios, basePath: string = basePath\) =>/g,
        "return <T = unknown, R = AxiosResponse<T>>(axios: AxiosInstance = globalAxios, basePath: string = '') =>"
      );
    }

    // Fix the BaseAPI constructor to avoid "Cannot access 'basePath' before initialization"
    if (file === "base.ts") {
      content = content.replace(
        /constructor\(configuration\?: Configuration, basePath: string = basePath, axios: AxiosInstance = globalAxios\) {/g,
        "constructor(configuration?: Configuration, basePath: string = '', axios: AxiosInstance = globalAxios) {"
      );
    }

    content = transformSnakeToCamel(content);
    fs.writeFileSync(filePath, content);
  }
});

// Generate client wrappers
const imports = apiClasses
  .map(
    (api) =>
      `import { ${api.className} } from './${api.fileName.replace(".ts", "")}';`
  )
  .join("\n");

const clientContent = `import { Configuration } from '../configuration';
${imports}

export interface BaasClientConfig {
  apiKey: string;
  baseUrl?: string;
}

/**
 * Main client for the Meeting BaaS API
 * This class combines all API endpoints into a single client
 */
export class BaasClient {
  private configuration: Configuration;
  ${apiClasses
    .map((api) => {
      const instanceName =
        api.className.charAt(0).toLowerCase() + api.className.slice(1);
      return `private _${instanceName}: ${api.className};`;
    })
    .join("\n  ")}

  constructor(config: BaasClientConfig) {
    this.configuration = new Configuration({
      apiKey: config.apiKey,
      basePath: config.baseUrl,
    });
    ${apiClasses
      .map((api) => {
        const instanceName =
          api.className.charAt(0).toLowerCase() + api.className.slice(1);
        return `this._${instanceName} = new ${api.className}(this.configuration);`;
      })
      .join("\n    ")}
  }

  ${apiClasses
    .map((api) => {
      const instanceName =
        api.className.charAt(0).toLowerCase() + api.className.slice(1);
      return `/**
   * Get the ${api.className} instance
   */
  get ${instanceName}() {
    return this._${instanceName};
  }`;
    })
    .join("\n\n  ")}
}
`;

// Write client file
fs.writeFileSync(path.join(apiDir, "client.ts"), clientContent);

console.log("Post-generation transformations completed");
