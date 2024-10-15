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

    // Gets generic location data from the database that is not nested in another object/table
    const locationInfo = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM location_info;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const data = result.reduce((acc, current) => {
                    return { ...acc, ...current };
                }, {});
                resolve(data);
            }
        });
    });

    // Gets which languages are available
    const languages = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM languages;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    languages: result,
                });
            }
        });
    });

    // Gets which zip codes are available
    const zipCodes = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM zip_codes;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    zip_codes: result,
                });
            }
        });
    });

    // Gets which social media should be linked to
    const socialMedia = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM social_media;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    social_media: result,
                });
            }
        });
    });

    // Gets which dates the store is closed due to holidays
    const closedDates = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM closed_dates;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    closed_dates: result,
                });
            }
        });
    });

    // Gets the normal opening hours
    const openHours = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM open_hours;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    open_hours: result,
                });
            }
        });
    });

    // Gets differing opening hours
    const specialOpenHours = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM special_open_hours;", (err, result) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const groupByMonth = (data) => {
                return data.reduce((acc, curr) => {
                    const month = curr.month;
                    acc[month] = acc[month] || []; // Initialize if it doesn't exist
                    acc[month].push({
                        day: curr.day,
                        hours: curr.hours,
                        from_hour: curr.from_hour,
                        to_hour: curr.to_hour,
                        from_minute: curr.from_minute,
                        to_minute: curr.to_minute,
                        index: curr.index,
                    });
                    return acc;
                }, {});
            };

            const transformToArray = (grouped) => {
                return Object.entries(grouped).map(([month, open_hours]) => ({
                    month: Number(month),
                    open_hours,
                }));
            };

            const groupedByMonth = groupByMonth(result);
            const openHoursArrayByMonth = transformToArray(groupedByMonth);

            resolve({ special_open_hours: openHoursArrayByMonth });
        });
    });

    // Gets which cars are available and their details
    const cars = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM Cars;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    cars: result,
                });
            }
        });
    });

    // Gets which locations the store operates in
    const locations = new Promise((resolve, reject) => {
        dbConnection.query("SELECT * FROM locations;", (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    locations: result,
                });
            }
        });
    });

    // Formats the data into a single object and returns it
    return await Promise.all([locationInfo, languages, zipCodes, socialMedia, closedDates, openHours, specialOpenHours, cars, locations]).then((values) => {
        const data = values.reduce((acc, current) => {
            return { ...acc, ...current };
        }, {});
        return data;
    });
};

module.exports = {
    getLanguage,
    getLocation,
};
