---
sidebar_position: 8
---

# 📈 Reporting

WATA includes a comprehensive reporting system that provides visual analytics and performance tracking for your trading activity.

## Dashboard Overview

The reporting dashboard is built on Observable Framework and provides:

- Daily and cumulative profit tracking
- Performance analysis by action type (long, short)
- Win-rate and position duration metrics
- Interactive data exploration

![reporting_example.gif](../static/img/reporting_example.gif)

## Setting Up the Dashboard

### Requirements

To use the reporting system, you need:
- Node.js and npm installed
- DuckDB CLI installed
- Python 3.12+ (with required libraries in `./reporting/requirements.txt`)
- Ansible configured with proper inventory (same as deployment stage)

### Dashboard Setup Steps

1. **Run the Setup Script**
   ```bash
   ./reporting/setup_dashboard.sh
   ```
   This script creates a new Observable Framework project in `reporting/trading-dashboard`.

2. **Sync Trading Data**
   ```bash
   ./reporting/sync_reporting_data.sh
   ```
   This script synchronizes your trading data from the server to your local dashboard:
   - Fetches DuckDB data from your production server
   - Exports the database to Parquet format
   - Generates the necessary JSON files for visualization
   - Copies all data to the Observable Framework project

3. **Start the Dashboard Server**
   ```bash
   ./reporting/start_report_server.sh
   ```
   This launches the development server on port 4321.
   Access the dashboard at: http://localhost:4321

## Available Reports

The dashboard provides several views to analyze your trading performance:

### 1. Performance Overview
- Daily profit/loss chart
- Cumulative performance tracking
- Monthly and weekly summaries

### 2. Trade Analysis
- Performance by trade type
- Average trade duration
- Win/loss ratio
- Profit factor

### 3. Risk Metrics
- Maximum drawdown
- Risk/reward ratio
- Volatility measures

### 4. Time Analysis
- Performance by time of day
- Day of week analysis
- Trading frequency metrics

## Customizing the Dashboard

The Observable Framework makes it easy to customize the dashboard:
- Edit files in `reporting/trading-dashboard/src/pages/` to modify existing views
- Add new pages for custom analyses
- Adjust visualization parameters in the configuration files 