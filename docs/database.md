# Connect to database

## VPN Access
If you have VPN access to the LAN that the servers are on, you can skip to [step 2](#2-then-on-the-web-server-ssh-from-it-to-the-database-server) since you are already on the correct network.

## Connect via the Web Server
#### 1. First, connect to the web server.
```bash
ssh root@<Ip 1> -p <Port>
```
- Input password when prompted.

#### 2. Then on the web server ssh from it to the database server.
```bash
ssh root@<Ip 2>
```
- Input password when prompted.

#### 3. Login to the database on the database server. 
```bash
mysql -u <User> -p
```
- Input password when prompted.

## Connect via MySQL Workbench

To connect using MySQL Workbench, fill in the connection information as follows:

- **Host**: `<database-ip-address>`
- **Port**: `<mysql-port>`
- **Username**: `<username>`
- **Password**: `<mysql-password>`

## IPs & Passwords
The login information for both servers is available in [this locked google doc](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit). Access is given to maintainers.

## Database Structure

The database consists of three schemas and 19 tables. The three schemas are as follows: **Translation**, **Kiruna**, and **Lulea**. The **Kiruna** and **Lulea** schemas share the exact same structure.

Below are the diagrams for each schema:

- [Translation Schema](https://github.com/user-attachments/assets/f2d37e1d-0260-4f8b-9e5e-e539397822d8)
- [Kiruna Schema](https://github.com/user-attachments/assets/0da0714d-a454-452b-83a8-f8ed4f325752)

To create all the empty tables for the **Translation** schema, you can either import the SQL file below into Workbench or simply copy and paste the code:

- [Translation SQL](../sql/Translation.sql)

To create the tables for either the **Lulea** or **Kiruna** schemas (they share the same structure), follow the same steps with the file below:

- [Kiruna and Lulea SQL](../sql/Kiruna_and_Lulea.sql)

## Insert Data into Schemas

### Insert using MySQL Workbench or via the Database
You can insert data into tables using MySQL Workbench or by writing SQL code manually.

- **MySQL Workbench**: Use built-in features or write SQL code.
  - [Connect via MySQL Workbench](#connect-via-mysql-workbench)
- **Database**: Write SQL code directly in the database.
  - [Connect via The Web Server](#connect-via-the-web-server)

### Insert using Python scripts
Both the options above can be very tedious when inserting bulk data. To facilitate this, we've created some Python scripts that automatically insert all the data from YAML files. Follow the instructions below to use these scripts.

#### To fill the tables, run one of the Python scripts listed below. These scripts require an [.env file](https://drive.google.com/file/d/1bbLyv1HWyYzVd9tsMDsWBNocZKUnETIF/view?usp=drive_link) and insert data from the [YAML files](../db_insert_scripts/yaml_files/).

- **Schemas:**
  - [Kiruna Schema](../db_insert_scripts/kiruna.py)
  - [Lulea Schema](../db_insert_scripts/lulea.py)

- **Translation Schema:**
  - [Translation Keys Table](../db_insert_scripts/translation_keys.py)
  - [Languages Table](../db_insert_scripts/languages.py)
  - [Translations Table](../db_insert_scripts/translations.py)

**Note:** If you want to add new data, edit the corresponding YAML file, ensuring the structure is maintained. If you decide to create a new yamlfile you need to edit which file the python script is reading by editing the `yaml_files` variable.
  
