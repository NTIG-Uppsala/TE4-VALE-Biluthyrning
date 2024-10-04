// Takes a key from the data files and returns the corresponding translation from the language file
const translate = (lang, key) => {
    return lang[key] || key;
};

// Register the 'order' helper in Handlebars
const order = (array, language, key) => {
    const index = array.findIndex((element) => element[key] === language);
    if (index > -1) {
        const first = array.splice(index, 1);
        return first.concat(array);
    }
    return array; // Return the array as is if the language is not found
};

// Sort the holidays by moving the one's after the current date to the beginning of the array
const sort = (array) => {
    const now = new Date();
    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const before = array.filter((element) => element.date < dateString);
    const after = array.filter((element) => element.date >= dateString);
    return after.concat(before);
};

// Merge all rows of a table into a single row if they have the same data value
const merge = (array, otherOpeningHours, lang) => {
    const now = new Date();
    let openHours;
    const monthsWithDifferingOpeningHours = otherOpeningHours.map((element) => element.month);
    if (monthsWithDifferingOpeningHours.includes(now.getMonth())) {
        openHours = otherOpeningHours.find((element) => element.month === now.getMonth()).open_hours;
    } else {
        openHours = array;
    }

    const mergedHours = [];
    let currentRange = { startDay: null, endDay: null, hours: null };

    openHours.forEach(({ day, hours }, index) => {
        if (currentRange.hours === null) {
            currentRange = { startDay: day, endDay: day, hours };
        } else if (currentRange.hours === hours) {
            currentRange.endDay = day;
        } else {
            if (currentRange.startDay === currentRange.endDay) {
                mergedHours.push({ day: currentRange.startDay, hours: currentRange.hours });
            } else {
                const startDay = translate(lang, currentRange.startDay);
                let endDay = translate(lang, currentRange.endDay);
                if (!lang.capitalize_weekdays) {
                    endDay = endDay.toLowerCase();
                }
                mergedHours.push({ day: `${startDay} - ${endDay}`, hours: currentRange.hours });
            }
            currentRange = { startDay: day, endDay: day, hours };
        }
        if (index === openHours.length - 1) {
            if (currentRange.startDay === currentRange.endDay) {
                mergedHours.push({ day: currentRange.startDay, hours: currentRange.hours });
            } else {
                const startDay = translate(lang, currentRange.startDay);
                let endDay = translate(lang, currentRange.endDay);
                if (!lang.capitalize_weekdays) {
                    endDay = endDay.toLowerCase();
                }
                mergedHours.push({ day: `${startDay} - ${endDay}`, hours: currentRange.hours });
            }
        }
    });
    return mergedHours;
};

const currentStatus = (messages) => {
    const now = new Date();
};

module.exports = {
    translate,
    order,
    sort,
    merge,
    currentStatus,
};
