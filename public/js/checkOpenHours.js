// Check which document is open and viewed by the user
const lang = document.querySelector("#lang").textContent;
const cityLocation = document.querySelector("#location").textContent;

// Get the relevant data for the current index.html
const dataHours = localizationData[lang][cityLocation];

const now = new Date();

/* Generate an object which stores the opening hours and weekday names
* for the current location and locale.
*/
const parseOpenHours = (data) => {
    let open_hours;
    if (now.getMonth() === 6) {
       open_hours = data.location.july_open_hours; // Exception for opening hours during July
    }
    else {
       open_hours = data.location.open_hours;
    }

    // Handle incorrect data format input
    if (!data || !data.lang || !open_hours) {
        console.error("Invalid data structure");
        return {};
    }

    const daysOfWeek = {
        monday: { index: 1, name: data.lang.monday, data_name: "monday"},
        tuesday: { index: 2, name: data.lang.tuesday, data_name: "tuesday"},
        wednesday: { index: 3, name: data.lang.wednesday, data_name: "wednesday"},
        thursday: { index: 4, name: data.lang.thursday, data_name: "thursday"},
        friday: { index: 5, name: data.lang.friday, data_name: "friday"},
        saturday: { index: 6, name: data.lang.saturday, data_name: "saturday"},
        sunday: { index: 0, name: data.lang.sunday, data_name: "sunday"},
    };

    const openHours = {};

    // Go through and generate an entry for each day
    for (const dayKey in daysOfWeek) {
        const day = daysOfWeek[dayKey];
        const data_name = day.data_name;
        let from = false;
        let to = false;
        let hours = open_hours[dayKey].hours;

        if (hours !== "closed") {
            // Convert xx:xx - xx:xx opening hours format to [xxxx, xxxx]
            const [startHour, endHour] = hours.split(" - ").map(str => str.replace(":", "").padEnd(4, "0"));
            from = startHour;
            to = endHour;
        }
        else {
            hours = data.lang.closed;
        }

        // Add entry to openHours object
        openHours[day.index] = {
            name: day.name,
            data_name: data_name,
            from: from,
            to: to,
            hours_std: hours
        };
    }
    return openHours;
}

const closedDates = {
    0: {
        name: "januari",
        days: { 1: "Nyårsdagen", 6: "Trettondedag jul" },
    },
    4: {
        name: "maj",
        days: { 1: "Första maj" },
    },
    5: {
        name: "juni",
        days: { 6: "Nationaldagen" },
    },
    11: {
        name: "december",
        days: {
            24: "Julafton",
            25: "Juldagen",
            26: "Annandag jul",
            31: "Nyårsafton",
        },
    },
};

// Helper functions
const formatTimeString = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
};

// Merge rows with the exact same hours for a more readable and compact table
const mergeRowsWithSameHours = (table) => {
    const rows = table.querySelectorAll("tbody>tr");
    const processedRows = [];
    let previousDaySameHours = false;

    rows.forEach((row, index) => {
        const currentDay = row.querySelector("td[data-day]").dataset.day;
        const currentHours = row.querySelector("td[data-hours]").dataset.hours;

        // Using the dataHours object, the correct language is displayed in the table
        const currentDayText = dataHours.lang[currentDay];

        // If it's the first row, just add it to the list of processed rows
        if (index === 0) {
            processedRows.push(row);
            return;
        }

        const previousRow = processedRows[processedRows.length - 1];
        const previousDay = previousRow.querySelector("td[data-day]").dataset.day;
        const previousHours = previousRow.querySelector("td[data-hours]").dataset.hours;
        
        const previousDayText = dataHours.lang[previousDay];

        // If the current row has the same hours as the previous row, merge them
        if (currentHours === previousHours) {
            // If the previous row already had the same hours as the row before that, update the text
            if (previousDaySameHours) {
                previousRow.querySelector("td[data-day]").textContent = `${previousDayText} - ${currentDayText.toLowerCase()}`;
            } 
            // If the previous row didn't have the same hours as the row before that, add the current day to the text
            else {
                previousRow.querySelector("td[data-day]").textContent = `${previousDayText} - ${currentDayText.toLowerCase()}`;
                previousDaySameHours = true;
            }
        } 
        // If the current row has different hours than the previous row, add it to the list of processed rows
        else {
            processedRows.push(row);
            previousDaySameHours = false;
        }        
    });
    
    // Clear the existing table content
    table.innerHTML = '<tbody></tbody>';
    
    // Append the new processed rows to the table
    processedRows.forEach((row) => {
        table.querySelector("tbody").appendChild(row);
    });
};

const refreshDynamicOpenStatus = () => {
    let openHours = parseOpenHours(dataHours);

    openHoursTable = document.querySelectorAll(".open-hours-table");

    // Go through and change the content of each open-hours-table
    openHoursTable.forEach((table) => {
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = ''; // Clear tbody innerHTML

        /* Function to insert a weekday column and relating opening hours column 
        * for each row in the tbody element with the relevant data
        */
        const tableInsertHTML = (entryDataName, entryName, hoursData, hours) => {
            tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td data-day="${entryDataName}">${entryName}</td>
                <td data-hours="${hoursData}">${hours}</td>
            </tr>
            `);
        }
        
        const keys = Object.keys(openHours); //Select the keys from the openHours object
        const firstKey = keys.shift(); // This removes the first key and returns it
        keys.push(firstKey); // Move the "0" key to the bottom of keys, which is the key for Sunday

        /* Go through each key in the openHours object and change the 
        * tbody element's innerHTML with the relevant data
        */
        keys.forEach((key) => {
            const entry = openHours[key];
            if (key == 0) { // If the weekday is Sunday
                tableInsertHTML(entry.data_name, entry.name, "closed", entry.hours_std);
            }
            else {
                tableInsertHTML(entry.data_name, entry.name, entry.hours_std, entry.hours_std);
            }
        })
    });
    
    const openHoursMondayFirst = [];
    Object.keys(openHours).forEach((key) => {
        openHoursMondayFirst.push(openHours[key]);
    });
    openHoursMondayFirst.sort((a, b) => a - b);

    // Slice of the start of the week and re-add it to the end
    const openHoursTodayFirst = openHoursMondayFirst
        .slice(now.getDay() - 1)
        .concat(openHoursMondayFirst.slice(0, now.getDay() - 1));

    const followingDays = [];
    openHoursTodayFirst.forEach((dayNoDates, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() + index);

        let toDate = false;
        if (dayNoDates.to) {
            toDate = new Date(date);
            toDate.setHours(dayNoDates.to.slice(0, 2));
            toDate.setMinutes(dayNoDates.to.slice(2));
        }

        let fromDate = false;
        if (dayNoDates.from) {
            fromDate = new Date(date);
            fromDate.setHours(dayNoDates.from.slice(0, 2));
            fromDate.setMinutes(dayNoDates.from.slice(2));
        }

        const dayWithDates = {
            name: {
                plural: dayNoDates.name,
                singular: dayNoDates.name.toLowerCase(),
            },
            open: {
                date: fromDate,
                string: dayNoDates.from,
            },
            closing: {
                date: toDate,
                string: dayNoDates.to,
            },
        };
        if (
            closedDates[date.getMonth()] &&
            closedDates[date.getMonth()]["days"][date.getDate()]
        ) {
            dayWithDates.holiday =
                closedDates[date.getMonth()]["days"][date.getDate()];
            dayWithDates.open = false;
            dayWithDates.closing = false;
        }

        followingDays.push(dayWithDates);
    });

    let openStatusString = dataHours.lang.current_status_fallback;

    if (now < followingDays[0].open.date) {
        const time = formatTimeString(followingDays[0].open.string)
        openStatusString = dataHours.lang.not_open_yet.replace("${time}", time);

    } else if (now < followingDays[0].closing.date) {
        const time = formatTimeString(followingDays[0].closing.string)
        openStatusString = dataHours.lang.open_now.replace("${time}", time);

    } else {
        const nextOpenDay = followingDays.slice(1).filter((day) => day.closing.date && day.open.date)[0];
        const next_open_day = nextOpenDay.name.singular;
        const time = formatTimeString(nextOpenDay.open.string)
        if (followingDays[0].holiday) {
            const holiday = followingDays[0].holiday;
            openStatusString = dataHours.lang.closed_now_holiday.replace("${holiday}", holiday).replace("${next_open_day}", next_open_day).replace("${time}", time);
        } else if (followingDays[0].closing.string) {
            openStatusString = dataHours.lang.after_hours.replace("${next_open_day}", next_open_day).replace("${time}", time);
        } else {
            openStatusString = dataHours.lang.closed_now.replace("${next_open_day}", next_open_day).replace("${time}", time);
        }
    }

    const openStatusTag = document.getElementById("dynamic-open-hours-tag");
    openStatusTag.innerHTML = openStatusString;

    const table = document.querySelector(".closed-dates-table>tbody");
    const rows = table.querySelectorAll("tr");

    const holidays = Array.from(rows).map((row) => {
        return {
            month: parseInt(row.dataset.month),
            day: parseInt(row.dataset.day),
            date: row.querySelectorAll("td")[0].dataset.key,
            name: row.querySelectorAll("td")[1].dataset.key,
            state: row.querySelectorAll("td")[2].dataset.key
        };
    });

    // Get today's date
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    // Function to determine if a holiday is after today
    const isAfterToday = (holiday) => {
        return (
            holiday.month > todayMonth ||
            (holiday.month === todayMonth && holiday.day >= todayDate)
        );
    };

    // Separate holidays into those after today and before today
    let holidaysAfterToday = holidays.filter(isAfterToday);
    let holidaysBeforeToday = holidays.filter(holiday => !isAfterToday(holiday));

    // Function to sort list of date objects in ascending order
    const sortDates = (listOfDates) => {
        listOfDates.sort((a, b) => {
            if (a.month !== b.month) {
                return a.month - b.month; // Sort by month
            } 
            return a.day - b.day; // If months are equal, sort by day
        });
        return listOfDates;
    }

    // Sort each list of holidays
    holidaysAfterToday = sortDates(holidaysAfterToday);
    holidaysBeforeToday = sortDates(holidaysBeforeToday);

    // Combine them to have holidays after today come first, then those before today
    const sortedHolidays = [...holidaysAfterToday, ...holidaysBeforeToday];

    // Clear the existing table content
    table.innerHTML = '';

    // Append new rows to the table
    sortedHolidays.forEach((holiday) => {
        const row = document.createElement('tr');
        row.dataset.month = holiday.month;
        row.dataset.day = holiday.day;

        row.innerHTML = `
            <td data-key="${holiday.date}">${dataHours.lang[holiday.date] || holiday.date}</td>
            <td data-key="${holiday.name}">${dataHours.lang[holiday.name] || holiday.name}</td>
            <td data-key="${holiday.state}">${dataHours.lang[holiday.state] || holiday.state}</td>
        `;

        table.appendChild(row);
    });

    const tables = document.querySelectorAll(".open-hours-table");
    // Merge rows with the same hours in each table
    tables.forEach((table) => {
        mergeRowsWithSameHours(table);
    });
};

refreshDynamicOpenStatus();
