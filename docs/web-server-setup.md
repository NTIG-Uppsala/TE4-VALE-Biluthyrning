# Web Server Setup

1. SSH to server with root access, see [login credentials](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?tab=t.0).

2. run
```bash
wget https://raw.githubusercontent.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/refs/heads/backendConversion/server-scripts/install.sh
bash install.sh
```
This downloads the install script and runs it.

1. Run:
```bash
/usr/local/bin/deploy.sh <tag>
```
Where `<tag>` is the tag of the release you want to deploy. 
