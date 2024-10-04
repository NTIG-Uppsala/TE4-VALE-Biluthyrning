const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const acceptedLanguages = fs.readdirSync(path.join(__dirname, "..", "locale")).map((file) => path.basename(file, ".yml"));

// Get language data
// It first tries to get the language from the query string, then from the browser settings, and finally defaults to English
const getLanguage = (req, language) => {
    return yaml.load(fs.readFileSync(path.join(__dirname, "..", "locale", (language || req.acceptsLanguages(...acceptedLanguages) || "en") + ".yml"), "utf8"));
};

// Get location data
// It first tries to get the location from the query string, then defaults to Kiruna
const getLocation = (req, location) => {
    return yaml.load(fs.readFileSync(path.join(__dirname, "..", "data", (location || "kiruna") + ".yml"), "utf8"));
};

module.exports = {
    getLanguage,
    getLocation,
};
