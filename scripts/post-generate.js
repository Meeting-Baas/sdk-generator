const fs = require('fs');
const path = require('path');

// Function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

// Function to transform property names in an object
function transformProperties(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
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

// Function to recursively copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Read and transform the generated API files
const apiDir = path.join(__dirname, '../src/generated/baas/api');
const files = fs.readdirSync(apiDir);

// First pass: collect all API classes
const apiClasses = [];
files.forEach(file => {
  if (!file.endsWith('-api.ts')) return;
  const className = file.replace('.ts', '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  apiClasses.push({
    fileName: file,
    className: className
  });
});

// Second pass: transform snake_case to camelCase in method names
// but preserve certain constant names
files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  
  const filePath = path.join(apiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // First fix the constant names in both imports and usage
  content = content.replace(/\bDUMMY_BASEURL\b/g, 'DUMMY_BASE_URL');
  content = content.replace(/\bBASEPATH\b/g, 'BASE_PATH');
  
  // Then transform snake_case to camelCase in method names and parameters
  // but skip lines containing import statements
  const lines = content.split('\n');
  const transformedLines = lines.map(line => {
    if (line.trim().startsWith('import ')) {
      return line;
    }
    return line.replace(/(\w+)_(\w+)/g, (match, p1, p2) => {
      // Skip certain constants
      if (match === 'DUMMY_BASE_URL' || match === 'BASE_PATH') {
        return match;
      }
      return p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
    });
  });
  content = transformedLines.join('\n');
  
  fs.writeFileSync(filePath, content);
});

// Also fix the constant names in base.ts and common.ts
const baseFiles = ['base.ts', 'common.ts'];
baseFiles.forEach(file => {
  const filePath = path.join(__dirname, '../src/generated/baas', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\bDUMMY_BASEURL\b/g, 'DUMMY_BASE_URL');
    content = content.replace(/\bBASEPATH\b/g, 'BASE_PATH');
    fs.writeFileSync(filePath, content);
  }
});

// Generate client wrappers
const imports = apiClasses.map(api => 
  `import { ${api.className} } from './${api.fileName.replace('.ts', '')}';`
).join('\n');

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
  ${apiClasses.map(api => {
    const instanceName = api.className.charAt(0).toLowerCase() + api.className.slice(1);
    return `private _${instanceName}: ${api.className};`;
  }).join('\n  ')}

  constructor(config: BaasClientConfig) {
    this.configuration = new Configuration({
      apiKey: config.apiKey,
      basePath: config.baseUrl,
    });
    ${apiClasses.map(api => {
      const instanceName = api.className.charAt(0).toLowerCase() + api.className.slice(1);
      return `this._${instanceName} = new ${api.className}(this.configuration);`;
    }).join('\n    ')}
  }

  ${apiClasses.map(api => {
    const instanceName = api.className.charAt(0).toLowerCase() + api.className.slice(1);
    return `/**
   * Get the ${api.className} instance
   */
  get ${instanceName}() {
    return this._${instanceName};
  }`;
  }).join('\n\n  ')}
}
`;

// Write client file
fs.writeFileSync(path.join(apiDir, 'client.ts'), clientContent);

// Move files to correct location
const srcDir = path.join(__dirname, '../src/generated/baas');
const destDir = path.join(__dirname, '../src/baas');

// Create baas directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
copyDir(srcDir, destDir);

console.log('Post-generation transformations completed');
console.log('Files moved to correct location');
