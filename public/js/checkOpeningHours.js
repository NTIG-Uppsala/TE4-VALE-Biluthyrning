const lang = document.querySelector("#lang").textContent;
const cityLocation = document.querySelector("#location").textContent;

// Get the data for the current language and location
const dataHours = localizationData[lang][cityLocation];

console.log("Current Language Data (dataHours.lang):", dataHours.lang);

// Helper function
const formatTimeString = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
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

    // Convert closedDates object to an array of objects with a month, day, name, and monthName
    const holidays = Object.entries(closedDates).flatMap(
        ([month, { name: monthName, days }]) =>
            Object.entries(days).map(([day, name]) => ({
                month: parseInt(month),
                day: parseInt(day),
                name,
                monthName,
            }))
    );

    // Get today's date
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    // Function to determine if a holiday is before or after today
    const isAfterToday = (holiday) => {
        return (
            holiday.month > todayMonth ||
            (holiday.month === todayMonth && holiday.day >= todayDate)
        );
    };

    // Separate holidays into those after today and before today
    const holidaysAfterToday = holidays.filter(isAfterToday);
    const holidaysBeforeToday = holidays.filter(
        (holiday) => !isAfterToday(holiday)
    );

    // Combine them to have holidays after today come first, then those before today
    const sortedHolidays = [...holidaysAfterToday, ...holidaysBeforeToday];

    // Update the tables
    const tables = document.querySelectorAll(".closed-dates-table");

    tables.forEach((table) => {
        table.innerHTML = "<tbody></tbody>";
        const tbody = table.querySelector("tbody");
        sortedHolidays.forEach((holiday) => {
            const tr = document.createElement("tr");

            // Create a cell for the formatted date
            const tdDate = document.createElement("td");
            tdDate.setAttribute("data-key", `${holiday.monthName}_${holiday.day}`);
            tdDate.textContent = `${holiday.day} ${holiday.monthName}`; // Initial placeholder
            tr.appendChild(tdDate);

            // Create a cell for the holiday name
            const tdName = document.createElement("td");
            tdName.setAttribute("data-key", holiday.name);
            tdName.textContent = holiday.name; // Initial placeholder
            tr.appendChild(tdName);

            // Create a cell for the status
            const tdStatus = document.createElement("td");
            tdStatus.setAttribute("data-key", "closed");
            tdStatus.textContent = "closed"; // Initial placeholder
            tr.appendChild(tdStatus);

            tbody.appendChild(tr);
        });

        // Update the table content with localized values
        table.querySelectorAll("td[data-key]").forEach(td => {
            const key = td.getAttribute("data-key");
            const localizedText = dataHours.lang[key] || key; // Use the key if translation is not available
            td.textContent = localizedText;
        });
    });
};

refreshDynamicOpenStatus();
