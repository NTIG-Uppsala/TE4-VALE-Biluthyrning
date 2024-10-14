#!/bin/bash

# Function to install or update a package
install_or_update() {
    local package=$1

    if dpkg -s "$package" &> /dev/null; then
        echo "$package is already installed. Updating $package..."
        apt-get update -y && apt-get upgrade -y $package
        if [[ $? -ne 0 ]]; then
            echo "Error updating $package. Please check manually."
            exit 1
        fi
    else
        echo "$package is not installed. Installing $package..."
        apt-get update -y
        apt-get install -y $package
        if [[ $? -ne 0 ]]; then
            echo "Error installing $package. Please check manually."
            exit 1
        fi
    fi
}

# Install or update necessary packages
install_or_update "git"
install_or_update "nginx"
install_or_update "nodejs"
install_or_update "npm"

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

echo "Deployment of version $VERSION_TAG complete!"
echo "Restarting system in 5 seconds..."
sleep 5
reboot

EOL

# Clean up the /var/www directory
rm -rf /var/www/

# Make the deploy.sh script executable
chmod +x "$DEPLOY_SCRIPT_PATH"

echo "Installation complete! The deploy script has been created at $DEPLOY_SCRIPT_PATH"

# Modify the default NGINX config to set up reverse proxy to Node.js

echo "Configuring NGINX default server block for Node.js reverse proxy..."

NGINX_CONFIG_PATH="/etc/nginx/sites-available/default"

# Back up the original default NGINX configuration
if [ -f "$NGINX_CONFIG_PATH" ]; then
    cp "$NGINX_CONFIG_PATH" "$NGINX_CONFIG_PATH.bak"
    echo "Backed up the original NGINX config to $NGINX_CONFIG_PATH.bak"
fi

# Replace the default NGINX config with the new reverse proxy configuration
cat <<'EOL' > "$NGINX_CONFIG_PATH"
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
##

# Rate limiting to defend against brute-force attacks.
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

# Default server configuration
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	# SSL is left out since the reverse proxy handles it

	# Site root
	root /var/www/public;
	
	# Redirect you to express
	location = / {
		proxy_pass http://localhost:4000;
	}

	server_name _;

	location / {
		# Relays all other requests to express
		proxy_pass http://localhost:4000;

		# Rate limiting
		limit_req zone=one burst=20 nodelay;

		# Limit the allowed HTTP methods
		limit_except GET POST HEAD {
        	deny all;
    	}
	}

	# Should allow indexers to read the robots.txt file
    location ~ /robots.txt {
        allow all;
    }

	# Cache static files for 30 days
	location ~* \.(jpg|jpeg|png|gif|ico)$ {
	    expires 30d;
	    access_log off;
	}

	# Deny access to folders and files that should not be accessed
	location ~ /\.ht {
	    deny all;	
	}
	location ~ /\.git {
	    deny all;
	}
	location ~ /\.github {
	    deny all;
	}
	location ~ /\.vscode {
	    deny all;
	}
	location ~ /\.gitignore {
	    deny all;
	}
	location ~ /README.md {
	    deny all;
	}
	location ~ /tests {
	    deny all;
	}

	# Security patches
	add_header X-Frame-Options "SAMEORIGIN";
	add_header X-Content-Type-Options "nosniff";
	add_header X-XSS-Protection "1; mode=block";
}
EOL

# Restart NGINX to apply the changes
echo "Restarting NGINX to apply new configuration..."
systemctl restart nginx

if [[ $? -eq 0 ]]; then
    echo "NGINX configuration updated and service restarted successfully."
else
    echo "Failed to restart NGINX. Please check the configuration manually."
    exit 1
fi

echo "Script completed successfully."
