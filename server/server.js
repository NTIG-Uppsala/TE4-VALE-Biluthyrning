const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const session = require("express-session");
const mysql = require("mysql2")

// Import custom helpers
const handlebarsHelpers = require("./scripts/handlebars");
const expressHelpers = require("./scripts/expressHelpers");
const dataHelpers = require("./scripts/dataHandler");

// Create an Express application
const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

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
app.use(express.static(path.join(__dirname, "..", "public"))); // Serve static files
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Database connection
const dbKiruna = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_KIRUNA,
    port: process.env.DB_PORT,
});

const dbLulea = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LULEA,
    port: process.env.DB_PORT,
});

const dbLanguages = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LANGUAGES,
    port: process.env.DB_PORT,
});

dbKiruna.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to database");
});

dbLulea.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to database");
});

dbLanguages.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to database");
});

// Routes
// Index / Home page
app.get("/", (req, res) => {
    const data = {
        lang: dataHelpers.getLanguage(req),
        location: dataHelpers.getLocation(req),
        debugTime: req.query.debugKey === process.env.DEBUG_KEY ? req.query.debugTime : null,
    };
    expressHelpers.renderPage(req, res, data, "index");
});

// Change page language
app.post("/POST/language", (req, res) => {
    const { language, route } = req.body;
    req.session.language = language;
    req.session.save((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect(`/${route}`);
});

// Change store location
app.post("/POST/location", (req, res) => {
    const { location, route } = req.body;
    req.session.location = location;
    req.session.save((err) => {
        if (err) {
            console.error(err);
        }
    });
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

// Start the server
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
