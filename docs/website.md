---
sidebar_position: 10
---

# 📝 Documentation Website

This document explains how to work with the Docusaurus-based documentation website for WATA.

## Overview

The WATA documentation website is built with [Docusaurus](https://docusaurus.io/), a modern static website generator optimized for documentation sites. It's hosted on GitHub Pages and can be accessed at [https://ioiti.github.io/wata/](https://ioiti.github.io/wata/).

## Local Development

To run the documentation website locally:

1. Clone the WATA repository
   ```bash
   git clone https://github.com/IOITI/wata.git
   cd wata
   ```

2. Navigate to the website directory
   ```bash
   cd wata-docs
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm start
   ```

5. Open your browser to [http://localhost:3000/wata/](http://localhost:3000/wata/)

The development server features hot reloading, allowing you to see changes immediately as you edit files.

## Documentation Structure

The documentation is organized into the following sections:

- **Introduction**: Overview of WATA
- **Architecture**: System design and components
- **Trading Workflow**: How trades are processed
- **How-To Guide**: Step-by-step setup instructions
- **Configuration Guide**: Detailed configuration options
- **Deployment Guide**: How to deploy WATA
- **Saxo Authentication**: Authenticating with Saxo Bank
- **Database System**: Data storage and management
- **Reporting**: Analytics and visualization capabilities
- **Contributing**: How to contribute to WATA
- **FAQ**: Frequently asked questions

## Adding Content

To add new documentation:

1. Create a new Markdown file in the `docs/` directory with the appropriate sidebar position
   ```markdown
   ---
   sidebar_position: X
   ---
   
   # Title of Document
   
   Content goes here...
   ```

2. Add the document to the appropriate category in `sidebars.js`

3. Use Markdown for content, with support for:
   - Code blocks with syntax highlighting
   - Admonitions (notes, warnings, etc.)
   - Mermaid diagrams
   - Images and other media

## Deployment

The documentation website is automatically deployed to GitHub Pages whenever changes are pushed to the main branch. You can also manually deploy by running:

```bash
cd wata-docs
npm run gh-pages
```

This will build the site and push the changes to the `gh-pages` branch, which is configured to serve as the GitHub Pages source. 