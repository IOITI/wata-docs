---
sidebar_position: 6
---

# 🚀 Deployment Guide

This guide covers the setup and deployment process for WATA, from prerequisites to running the application.

## Prerequisites

Before deploying WATA, ensure you have:

- Saxo Bank account with API access
- Dedicated Ubuntu server (VPS or local machine)
- Docker and Docker Compose installed
- Python 3.12+
- Ansible (for automated deployment)
- Telegram bot for notifications
- _(Optional) TradingView account for webhook signals_

## Deployment Steps

### 1. Configure Inventory

- Copy the example Ansible inventory file:
  ```bash
  cp deploy/tools/ansible/inventory/inventory_example.ini deploy/tools/ansible/inventory/inventory.ini
  ```
- Edit `inventory.ini` with your server details:
  - Server hostname or IP
  - SSH user and authentication method
  - Other Ansible configuration as needed

### 2. Build Application Package

- Build the deployment package:
  ```bash
  ./package.sh
  ```
  This creates a distributable package with all necessary components.

### 3. Deploy to Your Server

- Run the deployment script:
  ```bash
  cd deploy/tools
  ./deploy_app_to_your_server.sh
  ```
- The script uses Ansible to:
  - Install required dependencies
  - Set up Docker and Docker Compose
  - Configure the application directory structure
  - Deploy the application files
  - Set up convenient aliases for management

### 4. Configure Application Settings

After deployment, you need to set up the configuration:

1. **Configure RabbitMQ Password**
   ```bash
   # Navigate to the deploy directory
   cd /app/deploy
   
   # Copy the example .env file
   cp .env.example .env
   
   # Edit the .env file to set your custom RabbitMQ password
   nano .env
   ```
   
   This sets the password used by RabbitMQ and automatically updates your config.json file through the setup service.

2. **Set Up Configuration File**
   ```bash
   cp /app/etc/config_example.json /app/etc/config.json
   nano /app/etc/config.json
   ```
   
   Update the configuration with your:
   - Saxo Bank API credentials
   - Telegram bot information
   - Trading rules and preferences
   - Other settings as needed

   For detailed configuration options, see the [Configuration Guide](./configuration).

### 5. Manage the Application

Use these aliases to manage WATA on your server:

- `watastart`: Start the application
- `watastop`: Stop the application
- `watalogs`: View application logs
- `watastatus`: Check application status
- `watasaxoauth <CODE>`: Submit Saxo authentication code

## Docker Compose Architecture

WATA uses Docker Compose with an enhanced configuration:

### Environment Variables

- The `.env` file in the `/app/deploy` directory manages sensitive configuration
- Primary use is setting the RabbitMQ password, which is synchronized with your config.json

### Service Dependencies

- A special `setup` service runs before other services to ensure proper configuration
- This service updates the RabbitMQ password in config.json to match your .env file
- All other services depend on both the setup service and RabbitMQ

### Container Structure

The application runs in several containers:

- **rabbitmq**: Message broker for inter-service communication
- **web_server**: Receives webhook signals
- **trader**: Handles Saxo Bank operations
- **scheduler**: Manages periodic tasks
- **telegram**: Handles notifications

## Troubleshooting

- **Container not starting**: Check logs with `watalogs` to identify issues
- **Authentication problems**: Verify Saxo credentials in config.json
- **Connection issues**: Ensure your server has proper internet access
- **Configuration problems**: Compare with example configuration for missing fields 