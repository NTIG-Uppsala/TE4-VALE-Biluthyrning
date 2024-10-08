const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Render a page using Handlebars
const renderPage = (req, res, data, page) => {
    // Gets the data from the YAML file for the Kiruna page
    const location = yaml.load(fs.readFileSync(path.join(__dirname, "..", "data", (data.location || "kiruna") + ".yml"), "utf8"));

    // Gets the language file based on the user's language preference
    const language = yaml.load(fs.readFileSync(path.join(__dirname, "..", "locale", (data.language || req.acceptsLanguages("sv", "en", "fi") || "en") + ".yml"), "utf8"));

    // Renders the page using the data and language file
    res.render(page, {
        layout: false,
        location: location.location,
        lang: language.lang,
        ...data,
    });
};

module.exports = {
    renderPage,
};
