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

try:
    # Database connection
    connection = mysql.connector.connect(
        host=os.getenv('host'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        database=os.getenv('database_3')
    )
    
    cursor = connection.cursor()
    logging.info("Successfully connected to the MySQL database.")
except mysql.connector.Error as err:
    logging.error(f"Error: {err}")
    exit(1)

def getOrCreateLanguages():
    # Check if the languages already exist
    cursor.execute("SELECT `code`, `name` FROM `languages` WHERE `code` IN ('sv', 'en', 'fi')")
    result = cursor.fetchall()  # Fetch all matching rows

    # If any of the languages exist, print a message and return
    if result:
        print("Some or all languages already exist")
        return

    # If the languages do not exist, insert them into the languages table
    cursor.execute("""
        INSERT INTO `languages` (`code`, `name`) VALUES
        ('sv', 'Swedish'),
        ('en', 'English'),
        ('fi', 'Finnish')
    """)
    connection.commit()  # Commit the transaction to save the changes
    print("Languages inserted successfully.")

# Call the function to insert languages
getOrCreateLanguages()

# Close connection
cursor.close()
connection.close()
logging.info("Database connection closed.")