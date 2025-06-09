#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $SCRIPT_DIR/

# Start the build process of the observable framework
npm run build

# Copy the built files to the static directory
rm -rf ../static/performance-chart/*
cp -R dist/* ../static/performance-chart/