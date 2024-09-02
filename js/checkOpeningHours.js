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
            closedDates[date.getMonth()][date.getDate()]
        ) {
            dayWithDates.holiday = closedDates[date.getMonth()][date.getDate()];
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
    const combinedOpenHours = [];
    let currentFrom;
    let currentTo;

    // Combine days with the same opening hours
    openHoursMondayFirst.forEach((day, index) => {
        if (day.from === currentFrom && day.to === currentTo) {
            combinedOpenHours[combinedOpenHours.length - 1].indexes.push(
                (index + 1) % 7
            );
            combinedOpenHours[combinedOpenHours.length - 1].name.push(day.name);
        } else {
            combinedOpenHours.push({
                name: [day.name],
                from: day.from,
                to: day.to,
                indexes: [(index + 1) % 7],
            });
            currentFrom = day.from;
            currentTo = day.to;
        }
    });

    // Format the day names
    combinedOpenHours.forEach((day) => {
        if (day.name.length > 1) {
            day.name = `${day.name[0]} - ${day.name[
                day.name.length - 1
            ].toLowerCase()}`;
        } else {
            day.name = day.name[0];
        }
    });

    const firstDay = combinedOpenHours.find((day) =>
        day.indexes.includes(now.getDay())
    );
    console.log(firstDay);
    for (let i = 0; i < combinedOpenHours.length; i++) {
        if (combinedOpenHours[i] === firstDay) {
            break;
        }
        combinedOpenHours.push(combinedOpenHours.shift());
        console.log(combinedOpenHours);
    }

    // Order the days starting with today
    // const orderedCombinedOpenHours = 

    const tables = document.querySelectorAll(".open-hours-table");
    
    // Update the tables
    tables.forEach((table) => {
        table.innerHTML = "<tbody></tbody>";
        const tbody = table.querySelector("tbody");
        combinedOpenHours.forEach((day) => {
            const tr = document.createElement("tr");
            const tdDay = document.createElement("td");
            tdDay.textContent = day.name;
            tr.appendChild(tdDay);
            const tdTime = document.createElement("td");
            if (day.from) {
                tdTime.textContent = `${formatTimeString(
                    day.from
                )} - ${formatTimeString(day.to)}`;
            } else {
                tdTime.textContent = "Stängt";
            }
            tr.appendChild(tdTime);
            tbody.appendChild(tr);
        });
    });
};

refreshDynamicOpenStatus();
