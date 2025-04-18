# WATA Documentation Website

This is the documentation website for WATA (Warrants Automated Trading Assistant), built using [Docusaurus 3](https://docusaurus.io/).

## Development

To start the development server:

```bash
cd wata-docs
npm start
```

This will start a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

To build the static site:

```bash
npm run build
```

This command generates static content into the `build` directory.

## Deployment

To deploy to GitHub Pages:

```bash
npm run gh-pages
```

This will build the website and push it to the `gh-pages` branch of your repository. Make sure you have proper GitHub permissions and SSH keys set up.

## Structure

- `docs/`: Documentation files in Markdown
- `src/`: React components and pages
- `static/`: Static files like images
- `docusaurus.config.js`: Docusaurus configuration
- `sidebars.js`: Sidebar configuration

## Contributing

Contributions to improve the documentation are welcome. Please feel free to submit pull requests or open issues if you find something that could be improved.
