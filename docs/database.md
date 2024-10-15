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
- [Kiruna Schema](https://github.com/user-attachments/assets/0da0714d-a454-452b-83a8-f8ed4f325752)

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
#### 2. To fill the tables, run one of the Python scripts listed below. These scripts require an [.env file*](https://drive.google.com/file/d/1bbLyv1HWyYzVd9tsMDsWBNocZKUnETIF/view?usp=drive_link) to insert data from the [YAML files](../db-insert-scripts/yaml-files/).

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

[Back to README](/README.md)
