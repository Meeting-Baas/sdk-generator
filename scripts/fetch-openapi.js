#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

// Ensure tmp directory exists
const tmpDir = path.resolve(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Target file path
const targetFile = path.resolve(__dirname, '../tmp/openapi.json');

console.log('Fetching OpenAPI spec from https://api.meetingbaas.com/openapi.json...');

// Make HTTPS request to api.meetingbaas.com
const req = https.get('https://api.meetingbaas.com/openapi.json', (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to fetch OpenAPI spec: ${res.statusCode} ${res.statusMessage}`);
    process.exit(1);
  }

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      // Validate that it's valid JSON
      JSON.parse(data);
      
      // Write to file
      fs.writeFileSync(targetFile, data);
      console.log(`OpenAPI spec saved to ${targetFile}`);
      process.exit(0);
    } catch (err) {
      console.error('Error: Invalid JSON received from server');
      console.error(err);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('Error fetching OpenAPI spec:');
  console.error(err);
  process.exit(1);
});

req.end(); 