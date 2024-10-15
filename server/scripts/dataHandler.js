const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Get language data
// It first tries to get the language from the query string, then from the browser settings, and finally defaults to English
const getLanguage = async (dbLanguages, language) => {
    return await new Promise((resolve, reject) => {
        dbLanguages.query(
            `SELECT 
            tk.key AS translation_key, 
            t.translation AS translation_value
        FROM 
            languages l
        JOIN 
            translations t ON l.id = t.language_id
        JOIN 
            translation_keys tk ON t.translation_key_id = tk.id
        WHERE 
            l.code = ?;`,
            [language],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    // Transform the array of objects into a single object
                    const translations = result.reduce((acc, curr) => {
                        acc[curr.translation_key] = curr.translation_value;
                        return acc;
                    }, {});
                    resolve(translations);
                }
            }
        );
    });
};

// Get location data
// It first tries to get the location from the query string, then defaults to Kiruna
const getLocation = async (dbConnection) => {
    const locationInfo = new Promise((resolve, reject) => {
        dbConnection.query(`SELECT * FROM location_info;`, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const data = result.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                resolve(data);
            }
        });
    });
    console.log(await locationInfo);
};

module.exports = {
    getLanguage,
    getLocation,
};
