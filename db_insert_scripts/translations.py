import yaml
from dotenv import load_dotenv
import mysql.connector
import logging
import os

# Load environment variables from .env file located one directory back
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# load yaml files
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

# get the language id
def get_language_id(lang):
    cursor.execute("SELECT id FROM languages WHERE `code` = %s", (lang,))
    result = cursor.fetchone()
    language_id = result[0]
    return language_id
    

# Function to get or create a translation key ID in the database
def get_translation_key_id(key):
    # Execute a SELECT query to check for ids in the translation_keys table
    cursor.execute("SELECT id FROM translation_keys WHERE `key` = %s", (key,))
    result = cursor.fetchone()  # Fetch the first row of the result set
    translation_key_id = result[0]
    return translation_key_id

def insert_translation(translation_key_id, language_id, translation):
    # Execute a SELECT query to check if the key already exists in the translations table
    cursor.execute("SELECT * FROM translations WHERE `translation_key_id` = %s AND `language_id` = %s", (translation_key_id, language_id))
    result = cursor.fetchone()
    if result:
        print("Translation already exists")
        return
    
    # If the key does not exist, insert it into the translations table
    cursor.execute("INSERT INTO translations (`translation_key_id`, `language_id`, translation) VALUES (%s, %s, %s)", (translation_key_id, language_id, translation))
    connection.commit()
    print("Translation inserted")
    row = cursor.fetchone() # Fetch the first row of the result set
    return row  # Return the entire row

# List of YAML files to process
yaml_files = ['en.yml', 'fi.yml', 'sv.yml']

# Directory containing the YAML files (same directory as the Python script)
locales_dir = os.path.dirname(__file__)
# Load and parse the YAML file into a Python dictionary

for yaml_file in yaml_files:
    file_path = os.path.join(locales_dir, 'yaml_files', yaml_file)
    data = load_yaml(file_path)
    #get the current language
    lang = yaml_file.split(".")[0]
    language_id = get_language_id(lang)
    
    
    
    # Iterate over each key in the loaded YAML data
    for key in data.keys():
        # get the translation from the yaml files
        translation = data[key]
        translation_key_id = get_translation_key_id(key)
        insert_translation(translation_key_id, language_id, translation)
    
    print(f"Processed {yaml_file}")