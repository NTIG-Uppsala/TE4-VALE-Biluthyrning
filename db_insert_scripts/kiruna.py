import yaml
from dotenv import load_dotenv
import mysql.connector
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file located one directory back
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Load YAML file
def load_yaml(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return yaml.safe_load(file)

# Database connection
try:
    conn = mysql.connector.connect(
        host=os.getenv('host'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        database=os.getenv('database_1')
    )
    
    cursor = conn.cursor()
    logging.info("Successfully connected to the MySQL database.")
except mysql.connector.Error as err:
    logging.error(f"Error: {err}")
    exit(1)

# Function to insert data into open_hours table
def insert_open_hours(data):
    select_query = """
    SELECT COUNT(*) FROM open_hours 
    WHERE day = %s AND hours = %s AND from_hour = %s AND to_hour = %s AND from_minute = %s AND to_minute = %s AND `index` = %s
    """
    insert_query = """
    INSERT INTO open_hours (day, hours, from_hour, to_hour, from_minute, to_minute, `index`)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(select_query, (
            item['day'], item['hours'], item['from_hour'], item['to_hour'],
            item['from_minute'], item['to_minute'], item['index']
        ))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Record for {item['day']} already exists")
        else:
            cursor.execute(insert_query, (
                item['day'], item['hours'], item['from_hour'], item['to_hour'],
                item['from_minute'], item['to_minute'], item['index']
            ))
            print(f"Record for {item['day']} inserted")
    conn.commit()

# Function to insert data into languages table
def insert_languages(data):
    select_query = "SELECT COUNT(*) FROM languages WHERE language_code = %s"
    insert_query = """
    INSERT INTO languages (language_name, language_code)
    VALUES (%s, %s)
    """
    for item in data:
        cursor.execute(select_query, (item['language_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Language {item['language_code']} already exists")
        else:
            cursor.execute(insert_query, (item['language_name'], item['language_code']))
            print(f"Language {item['language_code']} added")
    conn.commit()

# Function to insert data into social_media table
def insert_social_media(data):
    select_query = "SELECT COUNT(*) FROM social_media WHERE name = %s"
    insert_query = """
    INSERT INTO social_media (name, url, icon, source)
    VALUES (%s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(select_query, (item['name'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Social media {item['name']} already exists")
        else:
            cursor.execute(insert_query, (item['name'], item['url'], item['icon'], item['source']))
            print(f"Social media {item['name']} added")
    conn.commit()

# Function to insert data into location_info table
def insert_location_info(data):
    select_query = "SELECT COUNT(*) FROM location_info WHERE `key` = %s"
    insert_query = """
    INSERT INTO location_info (folder, `key`, zip_code, address, location, city, phone_number, mail)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(select_query, (data['key'],))
    result = cursor.fetchone()
    if result[0] > 0:
        print(f"Location info for {data['key']} already exists")
    else:
        cursor.execute(insert_query, (
            data['folder'], data['key'], data['zip_code'], data['address'],
            data['location'], data['city'], data['phone_number'], data['mail']
        ))
        print(f"Location info for {data['key']} added")
    conn.commit()

# Function to insert data into zip_codes table
def insert_zip_codes(data):
    select_query = "SELECT COUNT(*) FROM zip_codes WHERE zip_code = %s"
    insert_query = """
    INSERT INTO zip_codes (zip_code, price)
    VALUES (%s, %s)
    """
    for item in data:
        cursor.execute(select_query, (item['zip_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Zip code {item['zip_code']} already exists")
        else:
            cursor.execute(insert_query, (item['zip_code'], item['price']))
            print(f"Zip code {item['zip_code']} added")
    conn.commit()

# Function to insert data into special_open_hours table
def insert_special_open_hours(data):
    select_query = """
    SELECT COUNT(*) FROM special_open_hours 
    WHERE month = %s AND day = %s AND `index` = %s
    """
    insert_query = """
    INSERT INTO special_open_hours (month, day, hours, from_hour, to_hour, from_minute, to_minute, `index`)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    for month_data in data:
        month = month_data['month']
        for item in month_data['open_hours']:
            cursor.execute(select_query, (month, item['day'], item['index']))
            result = cursor.fetchone()
            if result[0] > 0:
                print(f"Special open hours for {item['day']} in month {month} already exists")
            else:
                cursor.execute(insert_query, (
                    month, item['day'], item['hours'], item['from_hour'], item['to_hour'],
                    item['from_minute'], item['to_minute'], item['index']
                ))
                print(f"Special open hours for {item['day']} in month {month} added")
    conn.commit()

# Function to insert data into closed_dates table
def insert_closed_dates(data):
    select_query = "SELECT COUNT(*) FROM closed_dates WHERE date_code = %s"
    insert_query = """
    INSERT INTO closed_dates (holiday, date_name, hours, date_code)
    VALUES (%s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(select_query, (item['date_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Closed date {item['date_code']} already exists")
        else:
            cursor.execute(insert_query, (item['holiday'], item['date_name'], item['hours'], item['date_code']))
            print(f"Closed date {item['date_code']} added")
    conn.commit()

# Function to insert data into Cars table
def insert_cars(data):
    select_query = "SELECT COUNT(*) FROM Cars WHERE name = %s AND year = %s"
    insert_query = """
    INSERT INTO Cars (name, year, price)
    VALUES (%s, %s, %s)
    """
    for item in data:
        cursor.execute(select_query, (item['name'], item['year']))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Car {item['name']} from year {item['year']} already exists")
        else:
            cursor.execute(insert_query, (item['name'], item['year'], item['price']))
            print(f"Car {item['name']} from year {item['year']} added")
    conn.commit()

# Directory containing the YAML files (same directory as the Python script)
locales_dir = os.path.dirname(__file__)

# List of YAML files to process
yaml_file = 'kiruna.yml'

# Construct the full file path for the current YAML file
file_path = os.path.join(locales_dir, 'yaml_files', yaml_file)

# Load and parse the YAML file into a Python dictionary
data = load_yaml(file_path)

# Insert data into the database
insert_location_info(data['location_info'])
insert_languages(data['languages'])
insert_closed_dates(data['closed_dates'])
insert_zip_codes(data['zip_codes'])
insert_open_hours(data['open_hours'])
insert_special_open_hours(data['special_open_hours'])
insert_social_media(data['social_media'])
insert_cars(data['Cars'])

# Log a message indicating that the current YAML file has been processed
logging.info(f"Processed {yaml_file}")

# Close connection
cursor.close()
conn.close()
logging.info("Database connection closed.")