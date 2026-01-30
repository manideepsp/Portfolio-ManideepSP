# Wiki Pages for Portfolio-ManideepSP

This directory contains comprehensive wiki documentation for the Portfolio-ManideepSP project.

## 📚 Wiki Pages

1. **Home.md** - Main wiki landing page with overview and navigation
2. **Getting-Started.md** - Installation and setup guide
3. **Configuration.md** - Detailed configuration options
4. **Architecture.md** - Technical architecture and design
5. **Deployment.md** - Deployment guide for GitHub Pages and alternatives
6. **Contact-Form-Setup.md** - Cloudflare Worker setup for contact form
7. **Troubleshooting.md** - Common issues and solutions
8. **Contributing.md** - Contribution guidelines

## 🚀 How to Upload to GitHub Wiki

GitHub wikis are separate git repositories. Here's how to upload these pages:

### Method 1: Via GitHub Web Interface (Easiest)

1. Go to your repository on GitHub
2. Click on the **Wiki** tab
3. If wiki doesn't exist, click **Create the first page**
4. For each wiki page:
   - Click **New Page**
   - Copy the filename (without .md extension) as the page title
   - Copy the content from the corresponding .md file
   - Click **Save Page**

**Page titles to create:**
- `Home` (from Home.md)
- `Getting-Started` (from Getting-Started.md)
- `Configuration` (from Configuration.md)
- `Architecture` (from Architecture.md)
- `Deployment` (from Deployment.md)
- `Contact-Form-Setup` (from Contact-Form-Setup.md)
- `Troubleshooting` (from Troubleshooting.md)
- `Contributing` (from Contributing.md)

### Method 2: Via Git (Recommended for Multiple Pages)

GitHub wikis have their own git repository. You can clone and push to it:

#### Step 1: Enable Wiki

1. Go to your repository on GitHub
2. Go to **Settings** → **Features**
3. Enable **Wikis** if not already enabled

#### Step 2: Clone Wiki Repository

```bash
# Clone the wiki repository (separate from main repo)
git clone https://github.com/manideepsp/Portfolio-ManideepSP.wiki.git

# Navigate into the wiki directory
cd Portfolio-ManideepSP.wiki
```

#### Step 3: Copy Wiki Files

```bash
# Copy all wiki files from the main repository
cp /path/to/Portfolio-ManideepSP/wiki/*.md .

# Or if you're in the main repo directory
cp wiki/*.md ../Portfolio-ManideepSP.wiki/
```

#### Step 4: Commit and Push

```bash
# Add all wiki pages
git add *.md

# Commit
git commit -m "Add comprehensive wiki documentation"

# Push to GitHub
git push origin master
```

### Method 3: Using This Script

Save this as `upload-wiki.sh` and run it:

```bash
#!/bin/bash

# Configuration
REPO="manideepsp/Portfolio-ManideepSP"
WIKI_DIR="wiki"

# Clone wiki repository
echo "Cloning wiki repository..."
git clone https://github.com/${REPO}.wiki.git temp-wiki

# Copy wiki files
echo "Copying wiki files..."
cp ${WIKI_DIR}/*.md temp-wiki/

# Push to wiki
echo "Pushing to GitHub wiki..."
cd temp-wiki
git add *.md
git commit -m "Add/update wiki documentation"
git push origin master

# Cleanup
cd ..
rm -rf temp-wiki

echo "Wiki pages uploaded successfully!"
```

Run it:
```bash
chmod +x upload-wiki.sh
./upload-wiki.sh
```

## 📝 Wiki Structure

The wiki pages are organized with internal links:

```
Home (landing page)
├── Getting Started (installation)
│   └── Configuration (customization)
│       └── Deployment (going live)
│           └── Contact Form Setup (optional)
├── Architecture (technical deep-dive)
├── Troubleshooting (problem solving)
└── Contributing (for contributors)
```

## 🔄 Updating Wiki Pages

### To Update a Page:

**Via Web Interface:**
1. Navigate to the wiki page on GitHub
2. Click **Edit**
3. Make your changes
4. Click **Save Page**

**Via Git:**
```bash
# Clone wiki
git clone https://github.com/manideepsp/Portfolio-ManideepSP.wiki.git

# Edit files
vim Home.md

# Commit and push
git add Home.md
git commit -m "Update home page"
git push origin master
```

## 📋 Checklist Before Uploading

- [ ] All links between pages use correct format: `[Link Text](Page-Name)`
- [ ] No broken internal links
- [ ] Code examples are properly formatted
- [ ] All file paths are correct
- [ ] Repository-specific information is updated (URLs, usernames)
- [ ] Screenshots added where mentioned (optional)
- [ ] Table of contents is accurate

## 🔗 Internal Links Format

GitHub Wiki uses this format for internal links:
```markdown
[Link Text](Page-Name)
```

Examples:
```markdown
[Getting Started](Getting-Started)
[Configuration Guide](Configuration)
[Home Page](Home)
```

## 🎨 Formatting Tips

GitHub Wiki supports:
- Standard Markdown
- Tables
- Code blocks with syntax highlighting
- Task lists
- Emojis
- HTML (limited)

**Code blocks:**
```markdown
```bash
npm install
```
```

**Tables:**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
```

**Task lists:**
```markdown
- [ ] Task 1
- [x] Task 2 (completed)
```

## 🔍 Verifying Upload

After uploading, verify:

1. Visit `https://github.com/manideepsp/Portfolio-ManideepSP/wiki`
2. Check all pages appear in sidebar
3. Click through all internal links
4. Verify code formatting
5. Check images load (if any)
6. Test on mobile view

## 🛠️ Troubleshooting Upload

### Wiki Not Showing

**Problem:** Wiki tab not visible

**Solution:** 
- Settings → Features → Enable Wikis

### Permission Denied

**Problem:** Can't push to wiki repository

**Solution:**
- Check you have write access to the repository
- Verify GitHub credentials

### Links Not Working

**Problem:** Internal links return 404

**Solution:**
- Use exact page names (case-sensitive)
- Format: `[Text](Page-Name)` not `[Text](page-name.md)`

## 📞 Need Help?

- [GitHub Wiki Documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

## 🎉 You're Done!

Once uploaded, your wiki will be available at:
```
https://github.com/manideepsp/Portfolio-ManideepSP/wiki
```

Share this link with users to help them get started with your portfolio!

## 📄 License

These wiki pages are part of the Portfolio-ManideepSP project and are licensed under the MIT License.
