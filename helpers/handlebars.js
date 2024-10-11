
// Takes a key from the data files and returns the corresponding translation from the language file
const translate = (lang, key) => {
    return lang[key] || key;
};

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

        if (currentRange.hourRange === null) {
            // If an empty range is found, set the current range to the current row
            currentRange = { startDay: day, endDay: day, hourRange: hours };

        } else if (currentRange.hourRange === hours) {
            // If the current row has the same hours as the current range, extend the range
            currentRange.endDay = day;

        } else {
            // If the current row has different hours, add the current range to the merged hours

            if (currentRange.startDay === currentRange.endDay) {
                // If the range is only for one day, add the day as a string
                mergedDays.push({ day: currentRange.startDay, hours: currentRange.hourRange });

            } else {
                // If the range is for multiple days, add the days as a string with a dash in between the first and last day
                const startDay = translate(lang, currentRange.startDay);
                const endDay = lang.capitalize_weekdays ? translate(lang, currentRange.endDay) : translate(lang, currentRange.endDay).toLowerCase();

                mergedDays.push({ day: `${startDay} - ${endDay}`, hours: currentRange.hourRange });
            }

            // Set the current range to the current row
            currentRange = { startDay: day, endDay: day, hourRange: hours };
        }

        // Check if it is the last row
        if (!index === openDays.length - 1) {
            return;
        }

        if (currentRange.startDay === currentRange.endDay) {
            // If the range is only one day, add the day as a string
            mergedDays.push({ day: currentRange.startDay, hours: currentRange.hourRange });

        } else {
            // If the range is for multiple days, add the days as a string with a dash in between the first and last day e.g. "Monday - Wednesday"
            const startDay = translate(lang, currentRange.startDay);
            const endDay = lang.capitalize_weekdays ? translate(lang, currentRange.endDay) : translate(lang, currentRange.endDay).toLowerCase();

            mergedDays.push({ day: `${startDay} - ${endDay}`, hours: currentRange.hourRange });
        }
    });

    return mergedDays;
};

// Writes the current status of the store based on the current time
const currentStatus = (location, lang, debugTime) => {

    // When testing, the current time can be set to a specific time
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();

    const closedDates = location.closed_dates;
    let openHours;

    // The store has differing hours for different months
    const seasonalOpenHours = location.special_open_hours;

    // Check if the store has differing hours for the current month
    if (seasonalOpenHours.map((element) => element.month).includes(now.getMonth())) {
        openHours = seasonalOpenHours.find((element) => element.month === now.getMonth()).open_hours;
    } else {
        openHours = location.open_hours;
    }

    // Get the weekday object for the current day which contains the opening and closing hours
    const openHoursToday = openHours.find((element) => element.index === now.getDay());

    // This date is incremented until a day is found where the store is open
    const lookAheadDate = new Date(now);

    // Get the weekday object for the current day
    let nextOpenHours = openHours.find((element) => element.index === lookAheadDate.getDay());

    // Increment tempDate by 1 day until a day is found where the store is open
    while (
        closedDates.map((element) => element.date) // Is it a holiday?
            .includes(`${lookAheadDate.getMonth().toString().padStart(2, "0")}${lookAheadDate.getDate().toString().padStart(2, "0")}`)
        ||
        nextOpenHours.from_hour === null // Is it a weekday that is normally not open?
        ||
        nextOpenHours.to_hour === null // Is it a weekday that is normally not open?
        ||
        nextOpenHours.from_minute === null // Is it a weekday that is normally not open?
        ||
        nextOpenHours.to_minute === null // Is it a weekday that is normally not open?
        ||
        (
            // Check if it is the first iteration and the store has closed for the day
            lookAheadDate.getTime() === now.getTime()
            &&
            (
                now.getHours() > nextOpenHours.to_hour
                ||
                (
                    now.getHours() === nextOpenHours.to_hour
                    &&
                    now.getMinutes() >= nextOpenHours.to_minute
                )
            )
        )
    ) {
        // Increment tempDate by 1 day
        lookAheadDate.setDate(lookAheadDate.getDate() + 1);

        // Get the weekday object for the next day
        nextOpenHours = openHours.find((element) => element.index === lookAheadDate.getDay());
    }

    // Formats the current time to "MMDD"
    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

    // Check if it is a holiday
    if (closedDates.map((element) => element.date).includes(dateString)) {
        const holiday = lang[closedDates.find((element) => element.date === dateString).name_key];
        const nextOpenDay = lang.capitalize_weekdays ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
        const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
        return lang.closed_now_holiday.replace("${holiday}", holiday).replace("${next_open_day}", nextOpenDay).replace("${time}", time);
    }

    // Check if it is a weekday that is normally not open
    if (openHoursToday.from_hour === null || openHoursToday.to_hour === null || openHoursToday.from_minute === null || openHoursToday.to_minute === null) {
        const nextOpenDay = lang.capitalize_weekdays ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
        const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
        return lang.after_hours.replace("${next_open_day}", nextOpenDay).replace("${time}", time);
    }

    // Check if the store has not opened yet for the day
    if (now.getHours() < openHoursToday.from_hour || (now.getHours() === openHoursToday.from_hour && now.getMinutes() < openHoursToday.from_minute)) {
        const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
        return lang.not_open_yet.replace("${time}", time);
    }

    // Check if the store is currently open
    if (now.getHours() < openHoursToday.to_hour || (now.getHours() === openHoursToday.to_hour && now.getMinutes() < openHoursToday.to_minute)) {
        const time = `${nextOpenHours.to_hour.toString().padStart(2, "0")}:${nextOpenHours.to_minute.toString().padStart(2, "0")}`;
        return lang.open_now.replace("${time}", time);
    }

    // Check if the store has closed for the day
    const nextOpenDay = lang.capitalize_weekdays ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
    const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
    return lang.after_hours.replace("${next_open_day}", nextOpenDay).replace("${time}", time);
};

module.exports = {
    translate,
    order,
    sort,
    merge,
    currentStatus,
};
