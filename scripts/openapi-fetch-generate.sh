#!/bin/bash

set -e

# Make sure the tmp directory exists
mkdir -p tmp

# Fetch the OpenAPI spec
echo "Fetching OpenAPI specification from api.gmeetbot.com..."
curl -s https://api.gmeetbot.com/openapi.json > tmp/openapi-original.json

# Format it for readability
echo "Formatting OpenAPI specification..."
jq . tmp/openapi-original.json > tmp/openapi-formatted.json

# Copy the original spec as the fixed spec - as we're using the full spec
echo "Using the full API spec for generation..."
cp tmp/openapi-original.json tmp/openapi-fixed.json

# Count number of endpoints in the spec
ENDPOINT_COUNT=$(jq '.paths | keys | length' tmp/openapi-formatted.json)
echo "OpenAPI specification contains $ENDPOINT_COUNT endpoints"

# List all endpoints
echo "Endpoints in the API:"
jq -r '.paths | keys | .[]' tmp/openapi-formatted.json | sort

echo "API Version: $(jq -r '.info.version' tmp/openapi-formatted.json)"
echo "API Title: $(jq -r '.info.title' tmp/openapi-formatted.json)"

# Generate the SDK
if [ "$1" == "--generate" ]; then
  echo ""
  echo "Generating SDK from the full OpenAPI specification..."
  echo "This may take a moment..."
  
  # Add more verbose logging to the OpenAPI generator
  pnpm openapi:generate
  
  echo ""
  echo "SDK generation complete!"
  echo "Generated files can be found in: src/generated/baas/"
  
  # Count number of TypeScript files generated
  TS_FILE_COUNT=$(find src/generated/baas -type f -name "*.ts" | wc -l)
  echo "Generated $TS_FILE_COUNT TypeScript files"
  
  # List the API files
  echo "Generated API files:"
  find src/generated/baas -type f -name "*.ts" | grep -v "models" | grep -v "base\|common\|configuration\|index"
fi

echo ""
echo "Script completed successfully!"
echo "To generate the SDK, run: ./scripts/openapi-fetch-generate.sh --generate" 