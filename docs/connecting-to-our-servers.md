# Connecting to Our Servers

[Login Information](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing)


## Accessing the Servers' LAN
If the server you are connecting to has a public IP-address you can connect to the server without a VPN. To access the LAN via VPN, use the information in [this document](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing). If the VPN does not work, you can connect to a publicly accessible server that is on the LAN and from there connect to the other servers. In this case, the publicly accessible server is our prod web server.

#### To access our prod web server through the publicly accessible IP-address, use the login information under "Connecting to Prod" in [this document](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing) and follow the steps below.
- Enter the following command into a terminal:
```bash
ssh root@<web-server-public-ip> -p <web-server-public-port>
```
- Input `web-server-root-password` when prompted.

Once you have access to the LAN, you can connect to our servers by following the steps below.


## Connecting to the Web Servers
Make sure you have access to the LAN of the servers, see [Accessing the Servers' LAN](#accessing-the-servers-lan). 

To connect to a web server (whether it is the prod or dev web server, the information can be found in their own section of [this document](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing)) enter the following command into a terminal:
```bash
ssh root@<web-server-local-ip>
```
Input `web-server-root-password` when prompted.

_For more information about the web servers, see [web-server.md](/docs/web-server.md)_


## Connecting to the Database Servers
Make sure you have access to the LAN of the servers, see [Accessing the Servers' LAN](#accessing-the-servers-lan). 

To connect to a database server (whether it is the prod or dev database server, the information can be found in their own section of [this document](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit?usp=sharing)) enter the following command into a terminal:
```bash
ssh root@<database-server-local-ip>
```
Input `database-server-root-password` when prompted.

## Disconnecting from SSH
Press `CTRL + D` when focused on the terminal.

---

[Back to README](/README.md)