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

// Routes
app.get("/", (req, res) => {
    const data = {
        language: req.query.lang,
        location: req.query.location,
    };
    expressHelpers.renderPage(req, res, data, "index");
});

app.get("/POST/language", (req, res) => {
    const { language, route } = req.query;
    const redirectUrl = `/${route}?lang=${language}`;
    res.redirect(redirectUrl);
});

// This has to be changed when pushed to production
const server = app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
