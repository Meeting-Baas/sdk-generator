#!/bin/bash
set -e

echo "=============================================="
echo "Fetching OpenAPI specification from api.gmeetbot.com..."
echo "=============================================="

# Create tmp directory if it doesn't exist
mkdir -p tmp

# Fetch the original OpenAPI spec
curl -s https://api.meetingbaas.com/openapi.json > tmp/openapi-original.json
echo "Saved original spec to tmp/openapi-original.json ($(wc -l < tmp/openapi-original.json) lines)"

# Copy to the fixed version first
cp tmp/openapi-original.json tmp/openapi-fixed.json
echo "Created tmp/openapi-fixed.json"

# Print the endpoints in the original spec for reference
echo "Endpoints in original spec:"
jq -r '.paths | keys | join("\n")' tmp/openapi-original.json | sort

# Add any filtering or modification logic here if needed
# For now, we'll use the full spec

echo "=============================================="
echo "OpenAPI specification updated successfully"
echo "Ready to run: pnpm openapi:generate"
echo "=============================================="

# Optionally, run the generator if a parameter is provided
if [ "$1" == "--generate" ]; then
  echo "Running OpenAPI generator..."
  pnpm openapi:generate
fi
