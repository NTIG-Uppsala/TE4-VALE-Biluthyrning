#!/bin/bash

# 
# This script was in large part generated by chat gpt with major guidance and it has been validated by a human.
# 

# Function to install or update a package
install_or_update() {
    local package=$1

    if dpkg -s "$package" &> /dev/null; then
        echo "$package is already installed. Updating $package..."
        sudo apt-get update -y && sudo apt-get upgrade -y $package
        if [[ $? -ne 0 ]]; then
            echo "Error updating $package. Please check manually."
            exit 1
        fi
    else
        echo "$package is not installed. Installing $package..."
        sudo apt-get update -y
        sudo apt-get install -y $package
        if [[ $? -ne 0 ]]; then
            echo "Error installing $package. Please check manually."
            exit 1
        fi
    fi
}

# Install or update necessary packages
install_or_update "git"
install_or_update "nginx"

# Set up the systemd service to auto-start the Node.js app
echo "Setting up systemd service for application startup..."

# Create the start script
START_SCRIPT_PATH="/usr/local/bin/start.sh"
cat <<EOL > "$START_SCRIPT_PATH"
#!/bin/bash
cd /var/www || { echo "Directory /var/www does not exist."; exit 1; }
npm run start
EOL
chmod +x "$START_SCRIPT_PATH"

# Create the systemd service file
SERVICE_FILE_PATH="/etc/systemd/system/server-at-startup.service"
cat <<EOL > "$SERVICE_FILE_PATH"
[Unit]
Description=Start Node.js app using npm

[Service]
ExecStart=$START_SCRIPT_PATH
WorkingDirectory=/var/www
Restart=always
User=root
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd, enable the service, and start it
systemctl daemon-reload
systemctl enable server-at-startup.service
systemctl start server-at-startup.service

echo "Systemd service is now set up and enabled to start on boot."

# Create the deploy.sh script
DEPLOY_SCRIPT_PATH="/usr/local/bin/deploy.sh"
echo "Creating the deploy.sh script..."

cat <<'EOL' > "$DEPLOY_SCRIPT_PATH"
#!/bin/bash

# Ensure that the script receives exactly one argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version-tag>"
    exit 1
fi

# Store the version tag from the script argument
VERSION_TAG=$1

# Directory to ensure we're in
TARGET_DIR="/var/www"

# Ensure the script is running in /var/www
if [ "$(pwd)" != "$TARGET_DIR" ]; then
    echo "Switching to directory: $TARGET_DIR"
    cd $TARGET_DIR || { echo "Failed to switch to directory $TARGET_DIR"; exit 1; }
fi

# Perform git fetch to update remote references
echo "Fetching latest changes from the repository..."
git fetch --all || { echo "Git fetch failed"; exit 1; }

# Checkout the specified version tag
echo "Checking out tag: $VERSION_TAG"
git checkout tags/"$VERSION_TAG" || { echo "Failed to checkout tag: $VERSION_TAG"; exit 1; }

# Install dependencies and start the application
echo "Installing npm dependencies..."
npm install || { echo "Failed to install dependencies"; exit 1; }

# Stop any running Node.js processes
echo "Stopping any running Node.js processes..."
pkill node || echo "No Node.js processes found."

# Restart NGINX service
echo "Restarting NGINX..."
systemctl restart nginx || { echo "Failed to restart NGINX"; exit 1; }

echo "Starting the application..."
npm run start || { echo "Failed to start the application"; exit 1; }

echo "Deployment of version $VERSION_TAG complete!"

EOL

# Make the deploy.sh script executable
chmod +x "$DEPLOY_SCRIPT_PATH"

echo "Installation complete! The deploy script has been created at $DEPLOY_SCRIPT_PATH"
