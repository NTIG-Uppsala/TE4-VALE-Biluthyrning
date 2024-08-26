
// Dropdown code

const dropdownContent = document.querySelector(".opening-hours-dropdown");
const dropdownArrow = document.getElementById("dropdown-arrow");
dropdownArrow.setAttribute("data-state", "closed");

dropdownArrow.addEventListener("click", () => {
    dropdownContent.classList.toggle("open-dropdown");

    if (dropdownArrow.getAttribute("data-state") === "closed") {
        dropdownArrow.setAttribute("data-state", "open");
        dropdownArrow.style.transform = "rotate(180deg)";
    } else {
        dropdownArrow.setAttribute("data-state", "closed");
        dropdownArrow.style.transform = "rotate(0deg)";
    }
});


// Format and insert opening hours into the page

let blockOfOpenHours = ""

const openHoursMondayFirst = []
Object.keys(openHours).forEach(key => {
    openHoursMondayFirst.push(openHours[key]);
});
openHoursMondayFirst.sort((a, b) => a.order - b.order);

openHoursMondayFirst.forEach(day => {
    let dayOpenHours = ""

    dayOpenHours += day.name + " "
    if (day.from || day.to) {
        dayOpenHours += day.from.slice(0, 2) + ":" + day.from.slice(2);
        dayOpenHours += " - ";
        dayOpenHours += day.to.slice(0, 2) + ":" + day.to.slice(2);
    } else {
        dayOpenHours += "Stängt";
    }

    blockOfOpenHours += dayOpenHours + "<br>";
});

document.querySelectorAll(".insert-open-hours-in").forEach(element => {
    element.innerHTML += blockOfOpenHours;
});
document.querySelectorAll(".insert-open-hours-after").forEach(element => {
    element.insertAdjacentHTML("afterend", blockOfOpenHours);
});


// Dynamically update if we are open or closed

// Helper function
const formatTimeString = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
}
const now = new Date();

const refreshDynamicOpenStatus = () => {
    const openHoursMondayFirst = []
    Object.keys(openHours).forEach(key => {
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

        if (closedDates[date.getMonth()] && closedDates[date.getMonth()][date.getDate()]) {
            dayWithDates.holiday = closedDates[date.getMonth()][date.getDate()];
            dayWithDates.opening = false;
            dayWithDates.closing = false;
        }

        followingDays.push(dayWithDates);
    });

    let openStatusString = "Kolla våra öppettider för att se när vi har öppet.";

    if (now < followingDays[0].opening.date) {
        openStatusString = `Vi öppnar kl. ${formatTimeString(followingDays[0].opening.string)} idag.`;
    } else if (now < followingDays[0].closing.date) {
        openStatusString = `Vi har öppet nu och stänger kl. ${formatTimeString(followingDays[0].closing.string)}.`;
    } else {
        const nextOpenDay = followingDays.slice(1).filter(day => day.closing.date && day.opening.date)[0]

        if (followingDays[0].holiday) {
            openStatusString = `Vi har stängt på ${followingDays[0].holiday}.`;
        } else if (followingDays[0].closing.string && !followingDays[0].holiday) {
            openStatusString = `Vi har stängt för dagen.`;
        } else {
            openStatusString = `Vi har stängt idag.`;
        }

        openStatusString += `<br> Vi öppnar igen på ${nextOpenDay.name.singular} kl. ${formatTimeString(nextOpenDay.opening.string)}`
    }

    const openStatusTag = document.querySelector("p.open-status");
    openStatusTag.innerHTML = openStatusString;
}

refreshDynamicOpenStatus();
