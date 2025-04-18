import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import './404.css';

export default function NotFound() {
  return (
    <Layout
      title="Page Not Found"
      description="404 - This page could not be found">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-chart">
            <div className="chart-line chart-up"></div>
            <div className="chart-line chart-down"></div>
            <div className="chart-404">404</div>
          </div>
          
          <Heading as="h1" className="not-found-title">
            Trade Not Found
          </Heading>
          
          <p className="not-found-message">
            Looks like this position doesn't exist or was liquidated!
          </p>
          
          <div className="not-found-actions">
            <Link
              className="not-found-button primary-button"
              to="/docs/intro">
              Return to Documentation
            </Link>
            <Link
              className="not-found-button secondary-button"
              to="/">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 