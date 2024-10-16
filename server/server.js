const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const session = require("express-session");
const mysql = require("mysql2")
const fs = require("fs");
const sass = require("sass");

// Import custom helpers
const handlebarsHelpers = require("./scripts/handlebars");
const expressHelpers = require("./scripts/express-helpers");
const dataHelpers = require("./scripts/data-handler");

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
    console.log("Connected to Kiruna database");
});

dbLulea.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to Luleå database");
});

dbLanguages.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to Languages database");
});

const acceptedLanguages = ["sv", "en", "fi"];

// Routes
// Index / Home page
app.get("/", async (req, res) => {
    const language = req.session.language || req.acceptsLanguages(...acceptedLanguages) || "en";
    const location = req.session.location || "kiruna";
    const locationDb = location === "kiruna" ? dbKiruna : dbLulea;
    const data = {
        lang: await dataHelpers.getLanguage(dbLanguages, language),
        location: await dataHelpers.getLocation(locationDb),
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
app.get("/admin", async (req, res) => {
    if (!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }

    const language = req.session.language || req.acceptsLanguages(...acceptedLanguages) || "en";
    const location = req.session.location || "kiruna";
    const locationDb = location === "kiruna" ? dbKiruna : dbLulea;
    const data = {
        lang: await dataHelpers.getLanguage(dbLanguages, language),
        location: await dataHelpers.getLocation(locationDb),
    };
    expressHelpers.renderPage(req, res, data, "admin");
});

// Login page, redirects to admin page if already logged in
app.get("/login", async (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.location = req.session.isLoggedIn;
        res.redirect("/admin");
        return;
    }

    const language = req.session.language || req.acceptsLanguages(...acceptedLanguages) || "en";
    const data = {
        lang: await dataHelpers.getLanguage(dbLanguages, language),
    };
    expressHelpers.renderPage(req, res, data, "login");
});

// Noscript (JavaScript disabled) page
// Redirect from certain pages where JavaScript is strictly required if JavaScript is disabled
app.get("/noscript", async (req, res) => {
    const language = req.session.language || req.acceptsLanguages(...acceptedLanguages) || "en";
    const data = {
        lang: await dataHelpers.getLanguage(dbLanguages, language),
    };
    expressHelpers.renderPage(req, res, data, "noscript");
});

// Route for SCSS requests and compiling to CSS
app.get("/scss/:file", (req, res) => {
    const file = req.params.file;
    const scssFile = fs.readFileSync(path.join(__dirname, "scss", file), "utf8");
    const result = sass.compileString(scssFile, {
        sourceMap: true,
        loadPaths: [path.join(__dirname, "scss")],
    });
    res.setHeader("Content-Type", "text/css");
    res.send(result.css);
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

// Login route
app.post("/POST/login", async (req, res) => {
    const { password } = req.body;

    if (password === process.env.KIRUNA_PASSWORD) {
        req.session.isLoggedIn = "kiruna";
        req.session.location = "kiruna";
        res.redirect("/admin");

    } else if (password === process.env.LULEA_PASSWORD) {
        req.session.isLoggedIn = "lulea";
        req.session.location = "lulea";
        res.redirect("/admin");
    }
});

// Client requests for the location data
app.get("/GET/location", async (req, res) => {
    const location = req.session.location || "kiruna";
    const locationDb = location === "kiruna" ? dbKiruna : dbLulea;
    const data = await dataHelpers.getLocation(locationDb);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
});

// Client requests for the language data
app.get("/GET/language", async (req, res) => {
    const language = req.session.language || req.acceptsLanguages(...acceptedLanguages) || "en";
    const data = await dataHelpers.getLanguage(dbLanguages, language);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
});

// Change info in the database
app.post("/POST/set-data", async (req, res) => {
    const location_info = req.body;

    const keys = Object.keys(location_info);
    const values = Object.values(location_info);

    const promises = [];
    for (let index = 0; index < keys.length; index++) {
        const updateQuery = "UPDATE location_info SET ?? = ?";

        const location = req.session.location || "kiruna";
        const locationDb = location === "kiruna" ? dbKiruna : dbLulea;

        promises.push(
            new Promise((resolve, reject) =>
                locationDb.query(updateQuery, [keys[index], values[index]], (err, result) => {
                    if (err) {
                        console.error("Error executing query:", err.stack);
                        reject(err);
                        return;
                    }
                    resolve({ key: keys[index], value: values[index] });
                })
            ));
    }

    Promise.all(promises)
        .then(() => {
            res.status(200).send("Data updated");
        })
        .catch((error) => {
            console.error("Error executing query:", error.stack);
            res.status(500).send("Error executing query");
        });
});

// Log out route
app.post("/POST/logout", (req, res) => {
    console.log("User logged out");
    req.session.isLoggedIn = false;
    req.session.save((error) => {
        if (error) {
            console.error(error);
            logStream.write(`${new Date().toISOString()} - ${error}\n`);
        }
    });
    res.status(200).send("Logged out");
});

// Default route for requests that don't match any other routes. It currently redirects to the 404 page.
app.use((req, res) => {
    res.redirect("/404");
});

// Start the server
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
