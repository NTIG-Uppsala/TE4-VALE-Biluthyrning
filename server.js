const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Import custom helpers
const handlebarsHelpers = require("./helpers/handlebars");
const expressHelpers = require("./helpers/express");
const dataHelpers = require("./helpers/data");

// Create logs folder if it doesn't exist
const logsFolder = path.join(__dirname, "logs");

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
}

// Create a log file for the server using Date object to create a unique name
const logStream = 
    fs.createWriteStream(path.join(logsFolder, `server-${new Date().toISOString().replace(/:/g, "-")}.log`), 
    { flags: "a" }
);

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
);

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

// 404 page
app.get("/404", (req, res) => {
    const data = {
        lang: dataHelpers.getLanguage(req),
    };
    expressHelpers.renderPage(req, res, data, "404");
});

// Admin panel page, redirects to login page if not logged in
app.get("/admin", (req, res) => {
    if (!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    const data = {
        lang: dataHelpers.getLanguage(req),
    };
    expressHelpers.renderPage(req, res, data, "admin");
});

// Login page, redirects to admin page if already logged in
app.get("/login", (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/admin");
        return;
    }
    const data = {
        lang: dataHelpers.getLanguage(req),
    };
    expressHelpers.renderPage(req, res, data, "login");
});

// Noscript (JavaScript disabled) page
// Redirect from certain pages where JavaScript is strictly required if JavaScript is disabled
app.get("/noscript", (req, res) => {
    const data = {
        lang: dataHelpers.getLanguage(req),
    };
    expressHelpers.renderPage(req, res, data, "noscript");
});

// Change page language
app.post("/POST/language", (req, res) => {
    const { language, route } = req.body;
    req.session.language = language;
    req.session.save((err) => {
        if (err) {
            console.error(err);
            logStream.write(`${new Date().toISOString()} - ${err}\n`);
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
            logStream.write(`${new Date().toISOString()} - ${err}\n`);
        }
    });
    res.redirect(`/${route}`);
});

// Login route
app.post("/POST/login", async (req, res) => {
    const { password } = req.body;
    console.log(password);
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

// Default route for requests that don't match any other routes. It currently redirects to the 404 page.
app.use((req, res) => {
    res.redirect("/404");
});

// Start the server
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
