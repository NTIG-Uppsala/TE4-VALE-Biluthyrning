const lang = document.querySelector("#lang").textContent;
const cityLocation = document.querySelector("#location").textContent;

// Get the data for the current language and location
const dataHours = localizationData[lang][cityLocation];

// Helper functions
const formatTimeString = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
};

const mergeRowsWithSameHours = (table) => {
    const rows = table.querySelectorAll("tbody>tr");


    // Merge rows with the same hours so that the first cell contains the string "first day - last day"

    const mergedRows = [];
    let previousDaySameHours = false;

    rows.forEach((row, index) => {
        const currentDay = row.querySelector("td[data-day]").dataset.day;
        const currentHours = row.querySelector("td[data-hours]").dataset.hours;

        // Remember to use the dataHours object to get the correct language for text content but use data to set the correct dataset values
        const currentDayText = dataHours.lang[currentDay];

        if (index === 0) {
            mergedRows.push(row);
            return;
        }

        const previousRow = mergedRows[mergedRows.length - 1];
        const previousDay = previousRow.querySelector("td[data-day]").dataset.day;
        const previousHours = previousRow.querySelector("td[data-hours]").dataset.hours;
        
        const previousDayText = dataHours.lang[previousDay];

        if (currentHours === previousHours) {
            if (previousDaySameHours) {
                previousRow.querySelector("td[data-day]").textContent = `${previousDayText} - ${currentDayText.toLowerCase()}`;
            } else {
                previousRow.querySelector("td[data-day]").textContent = `${previousDayText} - ${currentDayText.toLowerCase()}`;
                previousDaySameHours = true;
            }
        } else {
            mergedRows.push(row);
            previousDaySameHours = false;
        }        
    });
    
    // Clear the existing table content
    table.innerHTML = '<tbody></tbody>';
    
    // Append the merged rows to the table
    mergedRows.forEach((row) => {
        table.querySelector("tbody").appendChild(row);
    });
};

const now = new Date();

const refreshDynamicOpenStatus = () => {
    const openHoursMondayFirst = [];
    Object.keys(openHours).forEach((key) => {
        openHoursMondayFirst.push(openHours[key]);
    });
    openHoursMondayFirst.sort((a, b) => a.order - b.order);

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
                singular: dayNoDates.nameSingular,
            },
            opening: {
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
            dayWithDates.opening = false;
            dayWithDates.closing = false;
        }

        followingDays.push(dayWithDates);
    });

    let openStatusString = dataHours.lang.current_status_fallback;

    if (now < followingDays[0].opening.date) {
        const time = formatTimeString(followingDays[0].opening.string)
        openStatusString = dataHours.lang.not_open_yet.replace("${time}", time);

    } else if (now < followingDays[0].closing.date) {
        const time = formatTimeString(followingDays[0].closing.string)
        openStatusString = dataHours.lang.open_now.replace("${time}", time);

    } else {
        const nextOpenDay = followingDays.slice(1).filter((day) => day.closing.date && day.opening.date)[0];
        const next_opening_day = nextOpenDay.name.singular;
        const time = formatTimeString(nextOpenDay.opening.string)
        if (followingDays[0].holiday) {
            const holiday = followingDays[0].holiday;
            openStatusString = dataHours.lang.closed_now_holiday.replace("${holiday}", holiday).replace("${next_opening_day}", next_opening_day).replace("${time}", time);
        } else if (followingDays[0].closing.string) {
            openStatusString = dataHours.lang.after_hours.replace("${next_opening_day}", next_opening_day).replace("${time}", time);
        } else {
            openStatusString = dataHours.lang.closed_now.replace("${next_opening_day}", next_opening_day).replace("${time}", time);
        }
    }

    const openStatusTag = document.getElementById("dynamic-opening-hours-tag");
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
