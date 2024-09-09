const fs = require('fs');
const handlebars = require('handlebars');
const yaml = require('js-yaml');

const inputFolder = 'locales/';  // Folder where localization files are stored
const templateFile = 'hbs/index.hbs';  // Template file to be used
const outputFolder = 'public/';  // Folder where output files will be stored

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Read and compile the Handlebars template
const templateContents = fs.readFileSync(templateFile, 'utf8');
const template = handlebars.compile(templateContents);

// Loop through all files in the input folder and convert them to a JS object
fs.readdirSync(inputFolder).forEach(file => {
  const fileContents = fs.readFileSync(`${inputFolder}${file}`, 'utf8');
  const data = yaml.load(fileContents);
  const [locale] = file.split('.');  // Extract the locale from the file name

  // Ensure the data structure matches the template structure
  const templateData = { index: data.index };  // Ensure data has an 'index' key

  // Generate the HTML output for the current locale
  const outputHtml = template(templateData);  // Pass the structured data to the template

  // Define the output directory for the current locale (e.g., public/en/)
  const localeOutputFolder = `${outputFolder}${locale}/`;

  // Create the locale-specific output folder if it doesn't exist
  if (!fs.existsSync(localeOutputFolder)) {
    fs.mkdirSync(localeOutputFolder, { recursive: true });
  }

  // Define the output file name (e.g., public/en/index.html)
  const outputFile = `${localeOutputFolder}index.html`;

  // Write the compiled HTML to the output file
  fs.writeFileSync(outputFile, outputHtml);

  console.log(`Generated ${outputFile}`);
});

console.log('All files have been generated successfully.');
