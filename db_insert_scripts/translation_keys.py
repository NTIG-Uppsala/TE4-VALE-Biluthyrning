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

try:
    # Database connection
    conn = mysql.connector.connect(
        host=os.getenv('host'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        database=os.getenv('database_3')
    )
    
    cursor = conn.cursor()
    logging.info("Successfully connected to the MySQL database.")
except mysql.connector.Error as err:
    logging.error(f"Error: {err}")
    exit(1)

# Function to get or create a translation key ID in the database
def get_or_create_translation_key_id(key):
    # Execute a SELECT query to check if the key already exists in the translation_keys table
    cursor.execute("SELECT id FROM translation_keys WHERE `key` = %s", (key,))
    result = cursor.fetchone()  # Fetch the first row of the result set
    
    # If the key exists, return its ID
    if result:
        print("Translation key already exists")
        return result[0]
        
    
    # If the key does not exist, insert it into the translation_keys table
    cursor.execute("INSERT INTO translation_keys (`key`) VALUES (%s)", (key,))
    conn.commit()  # Commit the transaction to save the changes
    
    # Return the ID of the newly inserted key
    return cursor.lastrowid

# Directory containing the YAML files (same directory as the Python script)
locales_dir = os.path.dirname(__file__)

# List of YAML files to process
yaml_files = ['en.yml', 'fi.yml', 'sv.yml']

# Process each YAML file in the list
for yaml_file in yaml_files:
    # Construct the full file path for the current YAML file
    file_path = os.path.join(locales_dir, 'yaml_files', yaml_file)
    
    # Load and parse the YAML file into a Python dictionary
    data = load_yaml(file_path)
    
    # Iterate over each key in the loaded YAML data
    for key in data.keys():
        # Insert the key into the database or get its ID if it already exists
        get_or_create_translation_key_id(key)
    
    # Log a message indicating that the current YAML file has been processed
    logging.info(f"Processed {yaml_file}")

# Close connection
cursor.close()
conn.close()
logging.info("Database connection closed.")