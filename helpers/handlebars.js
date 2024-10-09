// Takes a key from the data files and returns the corresponding translation from the language file
const translate = (lang, key) => {
    return lang[key] || key;
};

// Order the locations and languages so that the current language is first
const order = (array, language, key) => {
    const index = array.findIndex((element) => element[key] === language);
    if (index > -1) {
        const first = array.splice(index, 1);
        return first.concat(array);
    }
    return array; // Return the array as is if the language is not found
};

// Sort the holidays by moving the one's after the current date to the beginning of the array
const sort = (array, debugTime) => {
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();
    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const before = array.filter((element) => element.date < dateString);
    const after = array.filter((element) => element.date >= dateString);
    return after.concat(before);
};

// Merge all rows of a table into a single row if they have the same data value
const merge = (array, otherOpeningHours, lang, debugTime) => {
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();
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

// Writes the current status of the store based on the current time
const currentStatus = (location, lang, debugTime) => {
    const now = debugTime ? new Date(parseInt(debugTime)) : new Date();
    const closedDates = location.closed_dates;
    let openHours;

    const specialHours = location.special_open_hours;

    // Check if the store has differing hours for the current month
    if (specialHours.map((element) => element.month).includes(now.getMonth())) {
        openHours = specialHours.find((element) => element.month === now.getMonth()).open_hours;
    } else {
        openHours = location.open_hours;
    }

    const tempDate = new Date(now);

    // Get the weekday object for the current day
    let openHoursToday = openHours.find((element) => element.index === tempDate.getDay());
    // Increment tempDate by 1 day until a day is found where the store is open
    while (
        closedDates.map((element) => element.date).includes(`${tempDate.getMonth().toString().padStart(2, "0")}${tempDate.getDate().toString().padStart(2, "0")}`) || // Check if it is a holiday
        openHoursToday.from_hour === null || // Check if it is a weekday that is normally not open
        openHoursToday.to_hour === null || // Check if it is a weekday that is normally not open
        openHoursToday.from_minute === null || // Check if it is a weekday that is normally not open
        openHoursToday.to_minute === null || // Check if it is a weekday that is normally not open
        (tempDate.getTime() === now.getTime() && (now.getHours() > openHoursToday.to_hour || (now.getHours() === openHoursToday.to_hour && now.getMinutes() >= openHoursToday.to_minute))) // Check if it is the first iteration and the store has closed for the day
    ) {
        // Increment tempDate by 1 day
        tempDate.setDate(tempDate.getDate() + 1);

        // Get the weekday object for the next day
        openHoursToday = openHours.find((element) => element.index === tempDate.getDay());
    }

    // Get the weekday object for the next open day
    const nextOpenDayObject = openHours.find((element) => element.index === tempDate.getDay());

    // Formats the current time to "MMDD"
    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    // Check if it is a holiday
    if (closedDates.map((element) => element.date).includes(dateString)) {
        const holiday = closedDates.find((element) => element.date === dateString);
        const nextOpenDay = lang[capitalize_weekdays] ? lang[nextOpenDayObject.day] : lang[nextOpenDayObject.day].toLowerCase();
        const time = `${nextOpenDayObject.from_hour.toString().padStart(2, "0")}:${nextOpenDayObject.from_minute.toString().padStart(2, "0")}`;
        return lang.closed_now_holiday.replace("${holiday}", holiday.name).replace("${next_open_day}", nextOpenDay).replace("${time}", time);
    }

    // Check if it is a weekday that is normally not open
    if (openHoursToday.from_hour === null || openHoursToday.to_hour === null || openHoursToday.from_minute === null || openHoursToday.to_minute === null) {
        const nextOpenDay = lang[capitalize_weekdays] ? lang[nextOpenDayObject.day] : lang[nextOpenDayObject.day].toLowerCase();
        const time = `${nextOpenDayObject.from_hour.toString().padStart(2, "0")}:${nextOpenDayObject.from_minute.toString().padStart(2, "0")}`;
        return lang.after_hours.replace("${next_open_day}", nextOpenDay).replace("${time}", time);
    }
    // Check if the store has not opened yet for the day
    if (now.getHours() < openHoursToday.from_hour || (now.getHours() === openHoursToday.from_hour && now.getMinutes() < openHoursToday.from_minute)) {
        const time = `${openHoursToday.from_hour.toString().padStart(2, "0")}:${openHoursToday.from_minute.toString().padStart(2, "0")}`;
        return lang.not_open_yet.replace("${time}", time);
    }

    // Check if the store is currently open
    if (now.getHours() < openHoursToday.to_hour || (now.getHours() === openHoursToday.to_hour && now.getMinutes() < openHoursToday.to_minute)) {
        const time = `${openHoursToday.to_hour.toString().padStart(2, "0")}:${openHoursToday.to_minute.toString().padStart(2, "0")}`;
        return lang.open_now.replace("${time}", time);
    }

    // Check if the store has closed for the day
    const nextOpenDay = lang[capitalize_weekdays] ? lang[nextOpenDayObject.day] : lang[nextOpenDayObject.day].toLowerCase();
    const time = `${nextOpenDayObject.from_hour.toString().padStart(2, "0")}:${nextOpenDayObject.from_minute.toString().padStart(2, "0")}`;
    return lang.after_hours.replace("${next_open_day}", nextOpenDay).replace("${time}", time);
};

module.exports = {
    translate,
    order,
    sort,
    merge,
    currentStatus,
};
