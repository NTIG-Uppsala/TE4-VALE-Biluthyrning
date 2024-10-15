import yaml
from dotenv import load_dotenv
import mysql.connector
import logging
import os

# Load environment variables from .env file located one directory back
envPath = os.path.join(os.path.dirname(__file__), '..','..', '.env')
load_dotenv(envPath)

# load yaml files
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

# get the language id
def getLanguageId(lang):
    cursor.execute("SELECT id FROM languages WHERE `code` = %s", (lang,))
    result = cursor.fetchone()
    languageId = result[0]
    return languageId
    

# Function to get or create a translation key ID in the database
def getTranslationKeyId(key):
    # Execute a SELECT query to check for ids in the translation_keys table
    cursor.execute("SELECT id FROM translation_keys WHERE `key` = %s", (key,))
    result = cursor.fetchone()  # Fetch the first row of the result set
    translationKeyId = result[0]
    return translationKeyId

def insertTranslation(translationKeyId, languageId, translation):
    # Execute a SELECT query to check if the key already exists in the translations table
    cursor.execute("SELECT * FROM translations WHERE `translation_key_id` = %s AND `language_id` = %s", (translationKeyId, languageId))
    result = cursor.fetchone()
    if result:
        print("Translation already exists", result)
        return
    
    # If the key does not exist, insert it into the translations table
    cursor.execute("INSERT INTO translations (`translation_key_id`, `language_id`, translation) VALUES (%s, %s, %s)", (translationKeyId, languageId, translation))
    connection.commit()
    print("Translation inserted")
    row = cursor.fetchone() # Fetch the first row of the result set
    return row  # Return the entire row

# List of YAML files to process
yamlFiles = ['en.yml', 'fi.yml', 'sv.yml']

# Directory containing the YAML files (same directory as the Python script)
localesDir = os.path.dirname(__file__)
# Load and parse the YAML file into a Python dictionary

for yamlFile in yamlFiles:
    filePath = os.path.join(localesDir, 'yaml-files', yamlFile)
    data = loadYaml(filePath)
    #get the current language
    lang = yamlFile.split(".")[0]
    languageId = getLanguageId(lang)
    
    
    
    # Iterate over each key in the loaded YAML data
    for key in data.keys():
        # get the translation from the yaml files
        translation = data[key]
        translationKeyId = getTranslationKeyId(key)
        insertTranslation(translationKeyId, languageId, translation)
    
    print(f"Processed {yamlFile}")