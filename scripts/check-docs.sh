#!/bin/bash

# This script checks for common issues in the documentation before deployment

echo "Checking documentation for common issues..."

# Check for broken links in markdown files
broken_links=0
for file in docs/*.md; do
  grep -n "\[.*\]([^)]*)$" "$file" && broken_links=$((broken_links+1))
done

if [ $broken_links -gt 0 ]; then
  echo "⚠️  Warning: Found potentially broken links in documentation files."
else
  echo "✅ No broken links found in documentation files."
fi

# Check for missing sidebar entries
missing_sidebar=0
for file in docs/*.md; do
  filename=$(basename "$file" .md)
  if ! grep -q "'$filename'" sidebars.js; then
    echo "⚠️  Warning: $filename.md might be missing from sidebars.js"
    missing_sidebar=$((missing_sidebar+1))
  fi
done

if [ $missing_sidebar -eq 0 ]; then
  echo "✅ All documentation files appear to be included in the sidebar."
fi

# Build site to check for any build errors
echo "Building site to check for errors..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Documentation site builds successfully."
else
  echo "❌ Error: Documentation site failed to build."
  exit 1
fi

echo "Documentation check complete!" 