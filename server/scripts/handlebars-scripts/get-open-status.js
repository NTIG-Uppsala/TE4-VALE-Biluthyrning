// 
// The function in this script produces the text that shows the current status of the store based on the current time.
// 

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
        closedDates
            .map((element) => element.date_code) // Is it a holiday?
            .includes(`${lookAheadDate.getMonth().toString().padStart(2, "0")}${lookAheadDate.getDate().toString().padStart(2, "0")}`) ||
        nextOpenHours.from_hour === null || // Is it a weekday that is normally not open?
        nextOpenHours.to_hour === null || // Is it a weekday that is normally not open?
        nextOpenHours.from_minute === null || // Is it a weekday that is normally not open?
        nextOpenHours.to_minute === null || // Is it a weekday that is normally not open?
        // Check if it is the first iteration and the store has closed for the day
        (lookAheadDate.getTime() === now.getTime() && (now.getHours() > nextOpenHours.to_hour || (now.getHours() === nextOpenHours.to_hour && now.getMinutes() >= nextOpenHours.to_minute)))
    ) {
        // Increment tempDate by 1 day
        lookAheadDate.setDate(lookAheadDate.getDate() + 1);

        // Get the weekday object for the next day
        nextOpenHours = openHours.find((element) => element.index === lookAheadDate.getDay());
    }

    // Formats the current time to "MMDD"
    const dateString = `${now.getMonth().toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

    // Check if it is a holiday
    if (closedDates.map((element) => element.date_code).includes(dateString)) {
        const holiday = lang[closedDates.find((element) => element.date_code === dateString).name_key];
        const nextOpenDay = lang.capitalize_weekdays === 1 ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
        const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
        return lang.closed_now_holiday.replace("${holiday}", holiday).replace("${next_open_day}", nextOpenDay).replace("${time}", time);
    }

    // Check if it is a weekday that is normally not open
    if (openHoursToday.from_hour === null || openHoursToday.to_hour === null || openHoursToday.from_minute === null || openHoursToday.to_minute === null) {
        const nextOpenDay = lang.capitalize_weekdays === 1 ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
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
    const nextOpenDay = lang.capitalize_weekdays === 1 ? lang[nextOpenHours.day] : lang[nextOpenHours.day].toLowerCase();
    const time = `${nextOpenHours.from_hour.toString().padStart(2, "0")}:${nextOpenHours.from_minute.toString().padStart(2, "0")}`;
    return lang.after_hours.replace("${next_open_day}", nextOpenDay).replace("${time}", time);
};

module.exports = {
    currentStatus,
};