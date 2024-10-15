import yaml
from dotenv import load_dotenv
import mysql.connector
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file located one directory back
envPath = os.path.join(os.path.dirname(__file__), '..','..', '.env')
load_dotenv(envPath)

# Load YAML file
def loadYaml(filePath):
    with open(filePath, 'r', encoding='utf-8') as file:
        return yaml.safe_load(file)

# Database connection
try:
    connection = mysql.connector.connect(
        host=os.getenv('host'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        database=os.getenv('database_1')
    )
    cursor = connection.cursor()
    logging.info("Successfully connected to the MySQL database.")
except mysql.connector.Error as err:
    logging.error(f"Error: {err}")
    exit(1)

# Function to insert data into open_hours table
def insertOpenHours(data):
    selectQuery = """
    SELECT COUNT(*) FROM open_hours 
    WHERE day = %s
    """
    insertQuery = """
    INSERT INTO open_hours (day, hours, from_hour, to_hour, from_minute, to_minute, `index`)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['day'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Record for {item['day']} already exists")
        else:
            cursor.execute(insertQuery, (
                item['day'], item['hours'], item['from_hour'], item['to_hour'],
                item['from_minute'], item['to_minute'], item['index']
            ))
            print(f"Record for {item['day']} inserted")
    connection.commit()

# Function to insert data into languages table
def insertLanguages(data):
    selectQuery = "SELECT COUNT(*) FROM languages WHERE language_code = %s"
    insertQuery = """
    INSERT INTO languages (language_name, language_code)
    VALUES (%s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['language_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Language {item['language_code']} already exists")
        else:
            cursor.execute(insertQuery, (item['language_name'], item['language_code']))
            print(f"Language {item['language_code']} added")
    connection.commit()

# Function to insert data into social_media table
def insertSocialMedia(data):
    selectQuery = "SELECT COUNT(*) FROM social_media WHERE name = %s"
    insertQuery = """
    INSERT INTO social_media (name, url, icon, source)
    VALUES (%s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['name'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Social media {item['name']} already exists")
        else:
            cursor.execute(insertQuery, (item['name'], item['url'], item['icon'], item['source']))
            print(f"Social media {item['name']} added")
    connection.commit()

# Function to insert data into location_info table
def insertLocationInfo(data):
    selectQuery = "SELECT COUNT(*) FROM location_info WHERE `key` = %s"
    insertQuery = """
    INSERT INTO location_info (folder, `key`, zip_code, address, location, city, phone_number, mail, vat_on_car)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(selectQuery, (data['key'],))
    result = cursor.fetchone()
    if result[0] > 0:
        print(f"Location info for {data['key']} already exists")
    else:
        cursor.execute(insertQuery, (
            data['folder'], data['key'], data['zip_code'], data['address'],
            data['location'], data['city'], data['phone_number'], data['mail']
        ))
        print(f"Location info for {data['key']} added")
    connection.commit()

# Function to insert data into zip_codes table
def insertZipCodes(data):
    selectQuery = "SELECT COUNT(*) FROM zip_codes WHERE zip_code = %s"
    insertQuery = """
    INSERT INTO zip_codes (zip_code, price)
    VALUES (%s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['zip_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Zip code {item['zip_code']} already exists")
        else:
            cursor.execute(insertQuery, (item['zip_code'], item['price']))
            print(f"Zip code {item['zip_code']} added")
    connection.commit()

# Function to insert data into special_open_hours table
def insertSpecialOpenHours(data):
    selectQuery = """
    SELECT COUNT(*) FROM special_open_hours 
    WHERE month = %s AND day = %s AND `index` = %s
    """
    insertQuery = """
    INSERT INTO special_open_hours (month, day, hours, from_hour, to_hour, from_minute, to_minute, `index`)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    for monthData in data:
        month = monthData['month']
        for item in monthData['open_hours']:
            cursor.execute(selectQuery, (month, item['day'], item['index']))
            result = cursor.fetchone()
            if result[0] > 0:
                print(f"Special open hours for {item['day']} in month {month} already exists")
            else:
                cursor.execute(insertQuery, (
                    month, item['day'], item['hours'], item['from_hour'], item['to_hour'],
                    item['from_minute'], item['to_minute'], item['index']
                ))
                print(f"Special open hours for {item['day']} in month {month} added")
    connection.commit()

# Function to insert data into closed_dates table
def insertClosedDates(data):
    selectQuery = "SELECT COUNT(*) FROM closed_dates WHERE date_code = %s"
    insertQuery = """
    INSERT INTO closed_dates (holiday, date_name, hours, date_code)
    VALUES (%s, %s, %s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['date_code'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Closed date {item['date_code']} already exists")
        else:
            cursor.execute(insertQuery, (item['holiday'], item['date_name'], item['hours'], item['date_code']))
            print(f"Closed date {item['date_code']} added")
    connection.commit()

# Function to insert data into Cars table
def insertCars(data):
    selectQuery = "SELECT COUNT(*) FROM Cars WHERE name = %s AND year = %s"
    insertQuery = """
    INSERT INTO Cars (name, year, price)
    VALUES (%s, %s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['name'], item['year']))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Car {item['name']} from year {item['year']} already exists")
        else:
            cursor.execute(insertQuery, (item['name'], item['year'], item['price']))
            print(f"Car {item['name']} from year {item['year']} added")
    connection.commit()
    
def insertLocations(data):
    selectQuery = "SELECT COUNT(*) FROM locations WHERE name = %s"
    insertQuery = """
    INSERT INTO locations (name, code)
    VALUES (%s, %s)
    """
    for item in data:
        cursor.execute(selectQuery, (item['name'],))
        result = cursor.fetchone()
        if result[0] > 0:
            print(f"Location {item['code']} already exists")
        else:
            cursor.execute(insertQuery, (item['name'], item['code']))
            print(f"Location {item['code']} added")
    connection.commit()

# Directory containing the YAML files (same directory as the Python script)
localesDir = os.path.dirname(__file__)

# List of YAML files to process
yamlFile = 'kiruna.yml'

# Construct the full file path for the current YAML file
filePath = os.path.join(localesDir, 'yaml-files', yamlFile)

# Load and parse the YAML file into a Python dictionary
data = loadYaml(filePath)

# Insert data into the database
insertLocationInfo(data['location_info'])
insertLanguages(data['languages'])
insertClosedDates(data['closed_dates'])
insertZipCodes(data['zip_codes'])
insertOpenHours(data['open_hours'])
insertSpecialOpenHours(data['special_open_hours'])
insertSocialMedia(data['social_media'])
insertCars(data['Cars'])
insertLocations(data['locations'])

# Log a message indicating that the current YAML file has been processed
logging.info(f"Processed {yamlFile}")

# Close connection
cursor.close()
connection.close()
logging.info("Database connection closed.")