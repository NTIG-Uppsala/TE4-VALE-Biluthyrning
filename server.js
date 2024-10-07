const express = require("express");
const path = require("path");
const fs = require("fs");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const yaml = require("js-yaml");

// Import custom helpers
const handlebarsHelpers = require("./helpers/handlebars");
const expressHelpers = require("./helpers/express");
const dataHelpers = require("./helpers/data");

// Create an Express application
const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Set up Handlebars
const hbs = handlebars.create({
    extname: "hbs", // Specify the file extension for Handlebars templates
    helpers: handlebarsHelpers, // Specify helpers
});

// Set Handlebars as the view engine
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs"); // Use "handlebars" as the view engine
app.set("views", path.join(__dirname, "views")); // Set views directory

// Middleware setup
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

// Routes
app.get("/", (req, res) => {
    const data = {
        lang: dataHelpers.getLanguage(req),
        location: dataHelpers.getLocation(req),
    };
    expressHelpers.renderPage(req, res, data, "index");
});

// TODO: These currently only allow to change either the language or the location, but not both. If the user changes both, only the last change will be applied and the other will be reset to the default value.

app.post("/POST/language", (req, res) => {
    const { language, route } = req.body;
    req.session.language = language;
    res.redirect(`/${route}`);
});

app.post("/POST/location", (req, res) => {
    const { location, route } = req.body;
    req.session.location = location;
    res.redirect(`/${route}`);
});

// This has to be changed when pushed to production
const server = app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
