// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: '👋 Getting Started',
      collapsed: false,
      items: ['intro', 'architecture', 'trading-workflow'],
    },
    {
      type: 'category',
      label: '📚 User Guides',
      collapsed: false,
      items: ['how-to', 'configuration', 'saxo-authentication', 'deployment'],
    },
    {
      type: 'category',
      label: '📊 Data & Analytics',
      collapsed: false,
      items: ['database', 'reporting'],
    },
    {
      type: 'category',
      label: '❓ Help & Support',
      collapsed: false,
      items: ['faq'],
    },
    {
      type: 'category',
      label: '🛠️ Development',
      collapsed: false,
      items: ['contributing', 'website'],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
