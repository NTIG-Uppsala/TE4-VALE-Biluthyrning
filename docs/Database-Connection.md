# Connect to database

## VPN access
If you have VPN access to the LAN that the servers are on, you can skip to [step 2](#2-then-on-the-webserver-ssh-from-it-to-the-database-server) since you are already on the correct network.

## Connect via the webserver
#### 1. First, connect to the webserver.
```bash
ssh root@<Ip 1> -p <Port>
```
- Input password when prompted.

#### 2. Then on the webserver ssh from it to the database server.
```bash
ssh root@<Ip 2>
```
- Input password when prompted.

#### 3. Login to the database on the database server. 
```bash
mysql -u <User> -p
```
- Input password when prompted.

## IPs & Passwords
The login information for both servers is available in [this locked google doc](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit). Access is given to maintainers.