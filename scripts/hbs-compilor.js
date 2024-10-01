const fs = require('fs');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');  // Use only one Handlebars import

const inputFolder = 'locales/';  // Folder where localization files are stored
const locationFolder = 'locations/';  // Folder where location-specific files are stored
const templateFile = 'hbs/index.hbs';  // Template file to be used
const outputFolder = 'public/';  // Root folder where output files will be stored
const jsDataFolder = 'public/js/data/';  // Folder where the JavaScript object will be stored

const translate = (key, options) => {
  const langData = options.data.root.lang;  // Access the localization data from the root context
  return langData[key] || key;  // Return the translated value or the key itself if not found
};

// TODO: store JSON as data in a separate file as a fallback, in case fetch fails
const url = 'https://cars-prod.ntbbiluthyrning.workers.dev/api/cars';
let carsTable;

async function fetchCars() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json', // Specify JSON data
            },
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        // Parse the JSON from the response
        carsTable = await response.json();

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Call the fetch function
(async function main() {
  await fetchCars();
  
  // Register the helper using the arrow function syntax
  Handlebars.registerHelper('translate', translate);
  
  // Create the output folders if they don't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  if (!fs.existsSync(jsDataFolder)) {
    fs.mkdirSync(jsDataFolder, { recursive: true });
  }
  
  // Read and compile the Handlebars template
  const templateContents = fs.readFileSync(templateFile, 'utf8');
  const template = Handlebars.compile(templateContents);  // Correctly use the Handlebars instance
  
  // Initialize an object to store all localization and location combinations data
  const allLocalizationData = {};
  
  // Read all localization files and store them in an object
  const localizationData = {};
  fs.readdirSync(inputFolder).forEach(file => {
    const fileContents = fs.readFileSync(`${inputFolder}${file}`, 'utf8');
    const data = yaml.load(fileContents);
    const [locale] = file.split('.');  // Extract the locale from the file name
    localizationData[locale] = data;
  });
  
  // Read all location files and store them in an object
  const locationData = {};
  fs.readdirSync(locationFolder).forEach(file => {
    const fileContents = fs.readFileSync(`${locationFolder}${file}`, 'utf8');
    const data = yaml.load(fileContents);
    const [location] = file.split('.');  // Extract the location from the file name
    locationData[location] = data;
  });
  
  // Generate combinations of languages and locations
  Object.keys(localizationData).forEach(locale => {
    Object.keys(locationData).forEach(location => {
      // Initialize nested structure for each locale if not already present
      if (!allLocalizationData[locale]) {
        allLocalizationData[locale] = {};
      }
    
      // Combine data for current locale and location
      const combinedData = {
        ...localizationData[locale],
        ...locationData[location],
      };
    
      // Store the combined data in a nested object structure
      allLocalizationData[locale][location] = combinedData;
    
      // Ensure the data structure matches the template structure
      const templateData = { lang: combinedData.lang, location: combinedData.location, cars: carsTable};
    
      // Generate the HTML output for the current locale and location
      const outputHtml = template(templateData);  // Pass the structured data to the template
    
      // Define the output directory for the current combination (e.g., public/en/location1/)
      const combinationOutputFolder = `${outputFolder}${locale}/${location}/`;
    
      // Create the combination-specific output folder if it doesn't exist
      if (!fs.existsSync(combinationOutputFolder)) {
        fs.mkdirSync(combinationOutputFolder, { recursive: true });
      }
    
      // Define the output file name (e.g., public/en/location1/index.html)
      const outputFile = `${combinationOutputFolder}index.html`;
    
      // Write the compiled HTML to the output file
      fs.writeFileSync(outputFile, outputHtml);
    
      console.log(`Generated ${outputFile}`);
    });
  });
  
  // Function to convert JS object to a string without quotes around keys
  const objectToString = (obj) => {
    return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:');  // Remove quotes around object keys
  }
  
  // Write all localization data to a JavaScript file
  const jsDataFile = `${jsDataFolder}localizationData.js`;
  const jsDataContent = `const localizationData = ${objectToString(allLocalizationData)};`;
  fs.writeFileSync(jsDataFile, jsDataContent);
  
  console.log(`All localization data has been written to ${jsDataFile}`);
  console.log('All files have been generated successfully.');
})();