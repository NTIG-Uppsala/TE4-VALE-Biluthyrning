# Connect to and Modify Database

## VPN Access
If you have VPN access to the LAN that the servers are on, you can skip to [step 2](#2-then-on-the-web-server-ssh-from-it-to-the-database-server) since you are already on the correct network.

## Connect via the Web Server
#### 1. First, connect to the web server.
```bash
ssh root@<web-server-ip> -p <web-server-port>
```
- Input `web-server-root-password` when prompted.

#### 2. Then on the web server ssh from it to the database server.
```bash
ssh root@<database-server-ip>
```
- Input `database-server-root-password` when prompted.

#### 3. Login to the database on the database server. 
```bash
mysql -u <mysql-user> -p
```
- Input `mysql-password` when prompted.

If everything succeeded, you should now see the MySQL prompt in the terminal like shown below. 
```bash
mysql>
```
## Connect via MySQL Workbench

To connect using MySQL Workbench you must use a VPN. To connect, fill in the connection information as follows:

- **Host**: `<database-server-ip>`
- **Port**: `<mysql-port>`
- **Username**: `<mysql-user>`
- **Password**: `<mysql-password>`

## IPs & Passwords
All the login information for the servers is available in [this locked google doc](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit). Access is given to maintainers.

_*The folder contains login information for both the prod and the dev server._

## Database Structure

The database consists of three schemas and 19 tables. The three schemas are as follows: **Translation**, **Kiruna**, and **Lulea**. The **Kiruna** and **Lulea** schemas share the exact same structure.

Below are the diagrams for each schema:

- [Translation Schema](https://github.com/user-attachments/assets/f2d37e1d-0260-4f8b-9e5e-e539397822d8)
- [Kiruna and Luleå Schema](https://github.com/user-attachments/assets/8afc6317-a969-4d81-b962-35ecf66d63ea)


To create all the empty tables for the **Translation** schema, you can either import the SQL file below into Workbench or simply copy and paste the code:

- [Translation SQL](../database/sql/Translation.sql)

To create the tables for either the **Lulea** or **Kiruna** schemas (they share the same structure), follow the same steps with the file below:

- [Kiruna and Lulea SQL](../database/sql/Kiruna_and_Lulea.sql)

## Insert Data into Schemas

### Insert Using MySQL Workbench or via the Database
You can insert data into tables using MySQL Workbench or by writing SQL code manually.

- **MySQL Workbench**: Use built-in features or write SQL code.
  - [Connect via MySQL Workbench](#connect-via-mysql-workbench)
   _requires VPM_
- **Database**: Write SQL code directly in the database.
  - [Connect via The Web Server](#connect-via-the-web-server)

### Insert Using Python Scripts
Both the options above can be very tedious when inserting bulk data. To facilitate this, we've created some Python scripts that automatically insert all the data from YAML files, VPN is needed for this. Follow the instructions below to use the scripts.
#### 1. Run pip install on the required packages:
```bash
pip install pyyaml python-dotenv mysql-connector-python
```
#### 2. To fill the tables, run one of the Python scripts listed below. These scripts require an [.env file*](https://drive.google.com/drive/folders/1qnZZ7YAYeEiEnNQj128Wn9ABio7sOUUq?usp=drive_link) to insert data from the [YAML files](../db-insert-scripts/yaml-files/).

_*Download the .env file by clicking on the hyperlink and place the file in the root folder of the project. Also make sure it is named ".env" and not "env"._

- **Schemas:**
  - [Kiruna Schema](../database/db-insert-scripts/kiruna.py)
  - [Lulea Schema](../database/db-insert-scripts/lulea.py)

- **Translation Schema:**
  - [Translation Keys Table](../database/db-insert-scripts/translation-keys.py)
  - [Languages Table](../database/db-insert-scripts/languages.py)
  - [Translations Table](../database/db-insert-scripts/translations.py)

**Note:** If you want to add new data, edit the corresponding YAML file, ensuring the structure is maintained. If you decide to create a new YAML file you need to edit which file the python script is reading by editing the `yamlFile` variable.

---
## Install MySQL on a Server
To install sql first follow step 1 and 2 in [Connect via the Web Server](#connect-via-the-web-server) to ssh to the server.

### 1. Preparing to Install the Latest Version of MySQL Server

First, update the local package index. You will be prompted to enter your password.

```bash
sudo apt update
```

Next, upgrade the system packages:

```bash
sudo apt upgrade
```

Download the MySQL `.deb` package using `wget`:

```bash
wget https://dev.mysql.com/get/mysql-apt-config_0.8.32-1_all.deb
```

Verify the download by listing the files in the directory, it should look like this [ls](https://github.com/user-attachments/assets/8907a19e-4bdf-472c-8d22-4d544510523a)
:

```bash
ls
```

Install the downloaded package:

```bash
sudo apt install ./mysql-apt-config_0.8.32-1_all.deb
```

During the package configuration, select OK, then choose MySQL Server & Cluster, and press Enter. In the next window, select your desired MySQL version and press Enter.

Update the APT repository again:

```bash
sudo apt update
```

### 2. Install MySQL

Now, install MySQL Server:

```bash
sudo apt install mysql-server
```

After the installation, verify that the MySQL service is active, it should look like this [service mysql status](https://github.com/user-attachments/assets/a4e6d0be-e5cf-4340-b14e-30365aefdec8)
:

```bash
sudo service mysql status
```
### 3. Connect to the MySQL server

To connect to the SQL server, follow steps 3 and 4 in the [Connect via the Web Server](#connect-via-the-web-server) section. If you haven't created any users yet, you can use `root` as the `<mysql-user>`.
# Allow Remote Connections to MySQL Server

#### 1. Modify MySQL Configuration
_*In the database host_

First, add your external IP to the list of IPs that the server listens to. Open the MySQL configuration file with the following command:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Navigate to the line that begins with the `bind-address` directive and set it to your actual IP address or `0.0.0.0` which allows connections from all addresses.

If the `bind-address` directive is not present in your configuration file, you can add it manually.

####  2. Create a MySQL User for Remote Access
_*On the MySQL server:_

Next, create a MySQL user with access from a specific IP address or from any host by typing `%` as the `<ip-address>`.

```sql
CREATE USER 'username'@'<ip-address>' IDENTIFIED BY '<password>';
```

####  3. Grant Privileges to the User
_*On the MySQL server:_

Grant the necessary privileges to the newly created user.

```sql
GRANT ALL PRIVILEGES ON *.* TO 'username'@'<ip-address>';
```

####  4. Apply Changes
_*On the MySQL server:_

Finally, execute the following command to apply the changes:

```sql
FLUSH PRIVILEGES;
```

By following these steps, you should be able to allow remote connections to your MySQL server. Try connecting to the MySQL server by first exiting from the SQL server and then typing the following command with your newly created user:

```bash
mysql -u <mysql-user> -p
```
---

[Back to README.](/README.md)
