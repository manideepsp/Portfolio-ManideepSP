#!/bin/bash

# Wiki Upload Script for Portfolio-ManideepSP
# This script uploads wiki pages to GitHub Wiki

set -e  # Exit on error

# Configuration
REPO="manideepsp/Portfolio-ManideepSP"
WIKI_DIR="wiki"
TEMP_DIR="temp-wiki-$$"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Portfolio Wiki Upload Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if wiki directory exists
if [ ! -d "$WIKI_DIR" ]; then
    echo -e "${RED}Error: Wiki directory '$WIKI_DIR' not found${NC}"
    exit 1
fi

# Check if there are any .md files
if [ -z "$(ls -A $WIKI_DIR/*.md 2>/dev/null)" ]; then
    echo -e "${RED}Error: No .md files found in $WIKI_DIR${NC}"
    exit 1
fi

# Clone wiki repository
echo -e "${BLUE}[1/4]${NC} Cloning wiki repository..."
if ! git clone "https://github.com/${REPO}.wiki.git" "$TEMP_DIR" 2>/dev/null; then
    echo -e "${RED}Error: Failed to clone wiki repository${NC}"
    echo -e "${RED}Make sure the wiki is enabled in repository settings${NC}"
    exit 1
fi

# Copy wiki files
echo -e "${BLUE}[2/4]${NC} Copying wiki files..."
cp "$WIKI_DIR"/*.md "$TEMP_DIR/"
echo -e "${GREEN}✓${NC} Copied $(ls $WIKI_DIR/*.md | wc -l) wiki pages"

# List pages being uploaded
echo ""
echo "Pages to upload:"
for file in "$WIKI_DIR"/*.md; do
    basename=$(basename "$file" .md)
    echo "  - $basename"
done
echo ""

# Commit and push
echo -e "${BLUE}[3/4]${NC} Committing changes..."
cd "$TEMP_DIR"

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✓${NC} No changes to commit (wiki is up to date)"
else
    git add *.md
    git commit -m "Add/update wiki documentation

- Home page with overview
- Getting Started guide
- Configuration reference
- Architecture documentation
- Deployment instructions
- Contact Form setup guide
- Troubleshooting guide
- Contributing guidelines"
    
    echo -e "${BLUE}[4/4]${NC} Pushing to GitHub..."
    if git push origin master; then
        echo -e "${GREEN}✓${NC} Wiki pages uploaded successfully!"
    else
        echo -e "${RED}Error: Failed to push to GitHub${NC}"
        exit 1
    fi
fi

# Cleanup
cd ..
rm -rf "$TEMP_DIR"

# Success message
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Upload Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your wiki is now available at:"
echo -e "${BLUE}https://github.com/${REPO}/wiki${NC}"
echo ""
echo "Wiki pages uploaded:"
for file in "$WIKI_DIR"/*.md; do
    basename=$(basename "$file" .md)
    echo "  ✓ $basename"
done
echo ""

exit 0
