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
const apiDir = path.join(__dirname, '../src/generated/baas/generated/baas/api');
const files = fs.readdirSync(apiDir);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  
  const filePath = path.join(apiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Transform snake_case to camelCase in method names and parameters
  content = content.replace(/(\w+)_(\w+)/g, (match, p1, p2) => {
    return p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
  });
  
  fs.writeFileSync(filePath, content);
});

// Move files to correct location
const srcDir = path.join(__dirname, '../src/generated/baas/generated/baas');
const destDir = path.join(__dirname, '../src/baas');

// Create baas directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
copyDir(srcDir, destDir);

console.log('Post-generation transformations completed');
console.log('Files moved to correct location');
