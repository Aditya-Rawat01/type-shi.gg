#!/bin/bash

# setup.sh

# Check if the .env file already exists
if [ -f .env ]; then
    echo ".env file already exists. Skipping creation."
    echo "Only Copying the env variables."
    cp .env.example .env
    echo "Variables copied successfully."
    echo "Please review the .env file and fill in any necessary values."
else
    echo "Creating .env file from .env.example..."
    # Copy the example file to .env
    cp .env.example .env
    echo ".env file created successfully."
    echo "Please review the .env file and fill in any necessary values."
fi