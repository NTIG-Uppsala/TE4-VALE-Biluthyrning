# Web Server Setup

1. SSH to server with root access, see [login credentials](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?tab=t.0).

2. To set up the server, run the following commands:
```bash
wget https://raw.githubusercontent.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/refs/heads/backendConversion/server-scripts/install.sh
bash install.sh
```
This downloads the install script and runs it.

3. Clone the repository to the server, where `<tag_name>` is the tag of the release you want to deploy and `<repo_url>` is the URL of the repository.
```bash
git clone --branch <tag_name> <repo_url> /var/www/
```

4. When you are ready to deploy a new release, run the following command, where `<tag>` is the tag of the release you want to deploy.
```bash
/usr/local/bin/deploy.sh <tag>
```