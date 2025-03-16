#!/bin/bash
# Meeting BaaS Documentation Scraper
# This script downloads the documentation from Meeting BaaS API
# and converts it to markdown using Markdowner (https://md.dhr.wtf)

# Create output directory if it doesn't exist
mkdir -p baas_docs

# Main output file
OUTPUT_FILE="baas_docs/complete_baas_docs.md"
# Create/clear the output file
echo "# Meeting BaaS API Documentation" > $OUTPUT_FILE
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

# Main sections to scrape
echo "Starting download of Meeting BaaS documentation..."

# API Getting Started pages
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/sending-a-bot" "Sending a Bot"
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/removing-a-bot" "Removing a Bot"
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/getting-the-data" "Getting the Data"

# Calendar related pages
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/calendars/setup" "Calendars Setup"
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/calendars/events" "Calendar Events"
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/calendars/webhooks" "Calendar Webhooks"
fetch_page "https://docs.meetingbaas.com/docs/api/getting-started/calendars/maintenance" "Calendar Maintenance"

# Create individual files for each section as well
echo "Creating individual files for each section..."

# Generate individual files
mkdir -p baas_docs/getting-started
mkdir -p baas_docs/getting-started/calendars

# Instead of using associative arrays, directly create individual files
echo "Downloading individual files..."

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/sending-a-bot&llmFilter=true" > "baas_docs/getting-started/sending-a-bot.md"
echo "Created: sending-a-bot.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/removing-a-bot&llmFilter=true" > "baas_docs/getting-started/removing-a-bot.md"
echo "Created: removing-a-bot.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/getting-the-data&llmFilter=true" > "baas_docs/getting-started/getting-the-data.md"
echo "Created: getting-the-data.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/calendars/setup&llmFilter=true" > "baas_docs/getting-started/calendars/setup.md"
echo "Created: calendars/setup.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/calendars/events&llmFilter=true" > "baas_docs/getting-started/calendars/events.md"
echo "Created: calendars/events.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/calendars/webhooks&llmFilter=true" > "baas_docs/getting-started/calendars/webhooks.md"
echo "Created: calendars/webhooks.md"

curl -s -H 'Content-Type: text/plain' "https://md.dhr.wtf/?url=https://docs.meetingbaas.com/docs/api/getting-started/calendars/maintenance&llmFilter=true" > "baas_docs/getting-started/calendars/maintenance.md"
echo "Created: calendars/maintenance.md"

echo "Download complete. Documentation saved to $OUTPUT_FILE and individual section files in baas_docs/ directory."
