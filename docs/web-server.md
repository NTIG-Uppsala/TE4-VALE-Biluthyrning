# Web Server

## Connecting
1. SSH to the web server with root access, see [login credentials](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing). You might need VPN a to access the server, in that case the VPN connection details are in the same doc. For more details, see [connecting-to-our-servers.md](/docs/connecting-to-our-servers.md).


## Setup a New Web Server

1. SSH to the web server with root access, see [Connecting](#connecting).

2. To set up the web server, run the following commands:
```bash
wget https://raw.githubusercontent.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/refs/heads/backendConversion/server-scripts/install.sh
bash install.sh
```

3. Clone the repository to the server by running the following command:
```bash
git clone https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning.git /var/www/
```

4. You will need to set up the `.env` file at `/var/www/.env`. The file can be found [here](https://drive.google.com/file/d/1lmhCGe8ItjaIrP0iR04PWg-1RiKhOH2k/view?usp=drive_link). The file might be downloaded as `env` and needs to be renamed to `.env`.
   - Getting it to the web server can be done in multiple ways. If you SSH with VScode you can just drag and drop it.
   - To copy the file with the terminal you can open a new terminal (that is not the ssh terminal) and run the following command:
```bash
scp -P <web-server-port> "<your local path to .env>" root@<web-server-ip>:/var/www/.env
``` 
   -   Enter `web-server-root-password` when prompted.

5. When you are ready to deploy a new release, run the following command on the root of the server, where `<tag>` is the tag of the release you want to deploy.
```bash
/usr/local/bin/deploy.sh <tag>
```


## Deploying a new release
1. SSH to the web server with root access, see [Connecting](#connecting).

2. Run the following command, where `<tag>` is the tag of the release you want to deploy.
```bash
/usr/local/bin/deploy.sh <tag>
```

---
 
[Back to README](/README.md)