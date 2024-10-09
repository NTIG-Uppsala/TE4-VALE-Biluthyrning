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
    console.log(req.query);
    const data = {
        lang: dataHelpers.getLanguage(req),
        location: dataHelpers.getLocation(req),
        debugTime: req.query.debugKey === process.env.DEBUG_KEY ? req.query.debugTime : null,
    };
    expressHelpers.renderPage(req, res, data, "index");
});

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

// Client requests for the location data
app.get("/GET/location", (req, res) => {
    const data = dataHelpers.getLocation(req);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
});

// Client requests for the language data
app.get("/GET/language", (req, res) => {
    const data = dataHelpers.getLanguage(req);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
});

// Default route for requests that don't match any other routes. It currently redirects to the home page.
app.use((req, res) => {
    res.redirect("/");
});

// This has to be changed when pushed to production
const server = app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
