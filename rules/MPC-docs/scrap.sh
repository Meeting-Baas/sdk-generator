#!/bin/bash
# Model Context Protocol Documentation Scraper
# This script downloads the documentation from the Model Context Protocol specification
# and converts it to markdown using Markdowner (https://md.dhr.wtf)

# Create output directory if it doesn't exist
mkdir -p mcp_docs

# Main output file
OUTPUT_FILE="mcp_docs/complete_mcp_docs.md"
# Create/clear the output file
echo "# Model Context Protocol Documentation" > $OUTPUT_FILE
echo "Retrieved on $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to download a page and append it to our document
fetch_page() {
  local url="$1"
  local title="$2"

  echo "Downloading: $title from $url"

  # Add a section header to the document
  echo -e "\n\n## $title\n" >> $OUTPUT_FILE

  # Fetch the content and append to our file
  curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=$url&llmFilter=true" >> $OUTPUT_FILE

  # Add separator for readability
  echo -e "\n\n---\n" >> $OUTPUT_FILE

  # Sleep to avoid overwhelming the service
  sleep 2
}

# Base URL for the specification
BASE_URL="https://spec.modelcontextprotocol.io/specification/2024-11-05"

# Main sections from the menu based on screenshots
echo "Starting download of MCP documentation..."

# Main specification page
fetch_page "$BASE_URL/" "Specification Overview"

# Architecture
fetch_page "$BASE_URL/architecture/" "Architecture"

# Base Protocol
fetch_page "$BASE_URL/basic/" "Base Protocol"
fetch_page "$BASE_URL/basic/messages/" "Messages"
fetch_page "$BASE_URL/basic/lifecycle/" "Lifecycle"
fetch_page "$BASE_URL/basic/transports/" "Transports"
fetch_page "$BASE_URL/basic/versioning/" "Versioning"
fetch_page "$BASE_URL/basic/utilities/" "Utilities"

# Server Features
fetch_page "$BASE_URL/server/" "Server Features"
fetch_page "$BASE_URL/server/prompts/" "Prompts"
fetch_page "$BASE_URL/server/resources/" "Resources"
fetch_page "$BASE_URL/server/tools/" "Tools"
fetch_page "$BASE_URL/server/utilities/" "Server Utilities"

# Client Features
fetch_page "$BASE_URL/client/" "Client Features"
fetch_page "$BASE_URL/client/roots/" "Roots"
fetch_page "$BASE_URL/client/sampling/" "Sampling"

# Additional sections that might appear in the menu
fetch_page "$BASE_URL/contributions/" "Contributions"
fetch_page "$BASE_URL/revisions/" "Revisions"
fetch_page "$BASE_URL/schema/" "Schema"

# Create individual files for each section as well
echo "Creating individual files for each section..."

for section in "architecture" "basic" "basic/messages" "basic/lifecycle" "basic/transports" "basic/versioning" "basic/utilities" "server" "server/prompts" "server/resources" "server/tools" "server/utilities" "client" "client/roots" "client/sampling" "contributions" "revisions" "schema"; do
  section_title=$(echo "$section" | sed 's/.*\///' | sed 's/^./\U&/' | sed 's/_/ /g')
  output_file="mcp_docs/${section//\//_}.md"

  echo "# $section_title" > "$output_file"
  curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=$BASE_URL/$section/&llmFilter=true" >> "$output_file"
done

echo "Download complete. Documentation saved to $OUTPUT_FILE and individual section files in mcp_docs/ directory."
