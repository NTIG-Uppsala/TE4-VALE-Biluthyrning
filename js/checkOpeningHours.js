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

    // Create a copy of the opening hours list where multiple consecutive days with the same opening hours are combined into a single entry (e.g. "Måndag - onsdag"). Start with monday.
    // Example output:
    // [
    //     { name: "Måndag - fredag", from: "1000", to: "1600", indexes: [1, 2, 3, 4, 5] },
    //     { name: "Lördag", from: "1200", to: "1500", indexes: [6] },
    //     { name: "Söndag", from: false, to: false, indexes: [0] },
    // ]
    const combinedOpenHours = [];
    let currentCombinedDay = {
        name: openHoursTodayFirst[0].name,
        from: openHoursTodayFirst[0].from,
        to: openHoursTodayFirst[0].to,
        indexes: [0],
    };
    for (let i = 1; i < openHoursTodayFirst.length; i++) {
        if (
            openHoursTodayFirst[i].from === currentCombinedDay.from &&
            openHoursTodayFirst[i].to === currentCombinedDay.to
        ) {
            currentCombinedDay.name = `${currentCombinedDay.name} - ${
                openHoursTodayFirst[i].name
            }`;
            currentCombinedDay.indexes.push(i);
        } else {
            combinedOpenHours.push(currentCombinedDay);
            currentCombinedDay = {
                name: openHoursTodayFirst[i].name,
                from: openHoursTodayFirst[i].from,
                to: openHoursTodayFirst[i].to,
                indexes: [i],
            };
        }
    }
    combinedOpenHours.push(currentCombinedDay);

    console.log(combinedOpenHours);
    
};

refreshDynamicOpenStatus();
