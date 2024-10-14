// 
// The functions in this script makes the opening hours for the index.hbs file. They merge days that share the same opening hours.
// 

// Order the locations and languages so that the current language is first
const order = (items, language, key) => {
    const index = items.findIndex((element) => element[key] === language);

    if (index !== -1) {
        const first = items.splice(index, 1);
        return first.concat(items);
    }

    return items; // Return the array as is if the language is not found
};

// Sort the holidays by moving the ones after the current date to the beginning of the array
const sort = (holidays, debugTime) => {

    // When testing, the current time can be set to a specific time
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();

    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const datesBefore = holidays.filter((day) => day.date < dateString);
    const datesAfter = holidays.filter((day) => day.date >= dateString);

    return datesAfter.concat(datesBefore);
};

// Merge all rows of a table into a single row if they have the same data value
const merge = (dayObjects, differingOpeningHours, lang, debugTime) => {
    // When testing, the current time can be set to a specific time
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();

    // Check if the store has differing hours for the current month, else use the normal hours
    let openDays;
    const monthsWithDifferingOpeningHours = differingOpeningHours.map((element) => element.month);
    if (monthsWithDifferingOpeningHours.includes(now.getMonth())) {
        openDays = differingOpeningHours.find((element) => element.month === now.getMonth()).open_hours;
    } else {
        openDays = dayObjects;
    }

    // The days that share the same hours are merged into a single row
    const mergedDays = [];

    // The current range of days with the same hours
    let currentRange = { startDay: null, endDay: null, hourRange: null };

    // Merge all rows with the same hours
    openDays.forEach(({ day, hours }, index) => {
        // Check if it is the last day in the array
        const lastDay = index === openDays.length - 1;

        // Create a new range if the current range is empty
        if (!currentRange.hourRange) {
            currentRange = { startDay: day, endDay: day, hourRange: hours };
            if (lastDay) {
                mergedDays.push({ day: currentRange.startDay, hours: currentRange.hourRange });
            }
            return;
        }

        // Add the day to the current range if the hours are the same
        if (currentRange.hourRange === hours) {
            currentRange.endDay = day;
            if (lastDay) {
                // Check if the range spans multiple days and format the day label accordingly
                const dayLabel =
                    currentRange.startDay === currentRange.endDay
                        ? currentRange.startDay
                        : `${lang[currentRange.startDay]} - ${lang.capitalize_weekdays ? lang[currentRange.endDay] : lang[currentRange.endDay].toLowerCase()}`;
                mergedDays.push({ day: dayLabel, hours: currentRange.hourRange });
            }
            return;
        }
        // If the hours are different, add the current range to the merged days array and create a new range
        // Check if the range spans multiple days and format the day label accordingly
        const dayLabel =
            currentRange.startDay === currentRange.endDay
                ? currentRange.startDay
                : `${lang[currentRange.startDay]} - ${lang.capitalize_weekdays ? lang[currentRange.endDay] : lang[currentRange.endDay].toLowerCase()}`;
        mergedDays.push({ day: dayLabel, hours: currentRange.hourRange });
        currentRange = { startDay: day, endDay: day, hourRange: hours };
        if (lastDay) {
            mergedDays.push({ day: currentRange.startDay, hours: currentRange.hourRange });
        }
    });
    return mergedDays;
};

module.exports = {
    order,
    sort,
    merge,
};