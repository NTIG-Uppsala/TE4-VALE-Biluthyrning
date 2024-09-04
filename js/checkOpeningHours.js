// Helper function
const formatTimeString = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
};

const now = new Date();
now.setFullYear(2024, 11, 24);

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

    let openStatusString = "Kolla våra öppettider för att se när vi har öppet.";

    if (now < followingDays[0].opening.date) {
        openStatusString = `Vi öppnar kl. ${formatTimeString(
            followingDays[0].opening.string
        )} idag`;
    } else if (now < followingDays[0].closing.date) {
        openStatusString = `Vi har öppet nu och stänger kl. ${formatTimeString(
            followingDays[0].closing.string
        )}`;
    } else {
        const nextOpenDay = followingDays
            .slice(1)
            .filter((day) => day.closing.date && day.opening.date)[0];

        if (followingDays[0].holiday) {
            openStatusString = `Vi har stängt på ${followingDays[0].holiday}`;
        } else if (followingDays[0].closing.string) {
            openStatusString = `Vi har stängt för dagen`;
        } else {
            openStatusString = `Vi har stängt idag`;
        }

        openStatusString += `<br> Vi öppnar igen på ${
            nextOpenDay.name.singular
        } kl. ${formatTimeString(nextOpenDay.opening.string)}`;
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

            // Create a cell for the formatted date (e.g., "1 januari")
            const tdDate = document.createElement("td");
            tdDate.textContent = `${holiday.day} ${holiday.monthName}`;
            tr.appendChild(tdDate);

            // Create a cell for the holiday name
            const tdName = document.createElement("td");
            tdName.textContent = holiday.name;
            tr.appendChild(tdName);

            // Create a cell for the status (e.g., "Stängt")
            const tdStatus = document.createElement("td");
            tdStatus.textContent = "Stängt";
            tr.appendChild(tdStatus);

            tbody.appendChild(tr);
        });
    });
};

refreshDynamicOpenStatus();
