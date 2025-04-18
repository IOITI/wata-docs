---
sidebar_position: 7
---

# 💾 Database System

WATA uses DuckDB for fast in-memory analytics to store and analyze trading data. This approach provides several advantages for a trading system that needs to track performance metrics and analyze historical data.

## Database Architecture

DuckDB was chosen for WATA because it provides:

- **High-speed analytics**: In-memory processing with fast query execution
- **SQL compatibility**: Familiar query language for data analysis
- **Data integrity**: Reduced risk of database corruption
- **Lightweight footprint**: Minimal server resource requirements
- **Analytical capabilities**: Optimized for data analysis workloads

## Data Structure

The database stores several types of information:

1. **Order Tracking**
   - Complete order history
   - Execution details (price, time, size)
   - Order states and status changes

2. **Position Management**
   - Current and historical positions
   - Entry and exit points
   - Performance metrics (P&L, duration)
   - Position attributes (instrument, direction)

3. **Performance Analytics**
   - Daily statistics
   - Cumulative performance
   - Win/loss metrics
   - Trading patterns

## Database Configuration

The database location is specified in the `config.json` file:

```json
"duckdb": {
  "persistant": {
    "db_path": "/app/var/lib/duckdb/trading_data.duckdb"
  }
}
```

This configurable path allows you to:
- Back up the database easily
- Set a custom location based on your server setup
- Ensure data persistence across application restarts

## Data Extraction for Reporting

The database can be exported for use with the reporting dashboard:

1. Data is extracted from the DuckDB database
2. Converted to Parquet format for efficient storage
3. Used by the Observable Framework dashboard for visualization

This extraction process is handled by the reporting scripts in the `reporting/` directory. 