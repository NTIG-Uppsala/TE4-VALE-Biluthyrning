
// Dropdown code

const dropdown = document.querySelector(".opening-hours-dropdown");
const dropdownArrow = document.getElementById("dropdown-arrow");
dropdownArrow.setAttribute("data-state", "closed");

dropdownArrow.addEventListener("click", () => {
    dropdown.classList.toggle("open-dropdown");

    if (dropdownArrow.getAttribute("data-state") === "closed") {
        dropdownArrow.setAttribute("data-state", "open");
        dropdownArrow.style.transform = "rotate(180deg)";
    } else {
        dropdownArrow.setAttribute("data-state", "closed");
        dropdownArrow.style.transform = "rotate(0deg)";
    }
});


// Format and insert opening hours into the page

let openHoursString = ""

const sortedOpenHours = []
Object.keys(openHours).forEach(key => {
    sortedOpenHours.push(openHours[key]);
});
sortedOpenHours.sort((a, b) => a.order - b.order);

sortedOpenHours.forEach(day => {
    let dayString = ""

    dayString += day.name + " "
    if (day.from || day.to) {
        dayString += day.from.slice(0, 2) + ":" + day.from.slice(2);
        dayString += " - ";
        dayString += day.to.slice(0, 2) + ":" + day.to.slice(2);
    } else {
        dayString += "Stängt";
    }

    openHoursString += dayString + "<br>";
});

document.querySelectorAll(".insert-open-hours-in").forEach(element => {
    element.innerHTML += openHoursString;
});
document.querySelectorAll(".insert-open-hours-after").forEach(element => {
    element.insertAdjacentHTML("afterend", openHoursString);
});


// Dynamic open status

const formatTime = (time) => {
    const hour = time.slice(0, 2).padStart(2, "0");
    const minute = time.slice(2).padStart(2, "0");
    return hour + ":" + minute;
}

const now = new Date();
// now.setDate(now.getDate() + 6);
// now.setDate(23
// now.setMonth(11)
// now.setHours(17);

const sortedOpenHoursWithTodayFirst = sortedOpenHours
.slice(now.getDay() - 1)
.concat(sortedOpenHours.slice(0, now.getDay() - 1));

const nextWeek = [];
sortedOpenHoursWithTodayFirst.forEach((dayObject, index) => {

    const date = new Date(now);
    date.setDate(now.getDate() + index);

    let toDate = false;
    if (dayObject.to) {
        toDate = new Date(date);
        toDate.setHours(dayObject.to.slice(0, 2));
        toDate.setMinutes(dayObject.to.slice(2));
    }

    let fromDate = false;
    if (dayObject.from) {
        fromDate = new Date(date);
        fromDate.setHours(dayObject.from.slice(0, 2));
        fromDate.setMinutes(dayObject.from.slice(2));
    }

    const day = {
        name: {
            plural: dayObject.name,
            singular: dayObject.nameSingular,
        },
        from: {
            date: fromDate,
            string: dayObject.from,
        },
        to: {
            date: toDate,
            string: dayObject.to,
        },
    };

    if (closedDates[date.getMonth()] && closedDates[date.getMonth()][date.getDate()]) {
        day.reason = closedDates[date.getMonth()][date.getDate()];
        day.from = false;
        day.to = false;
    }

    nextWeek.push(day);
});


const refreshDynamicOpenStatus = () => {

    let openStatusString = "Kolla våra öppettider för att se när vi har öppet.";

    if (now < nextWeek[0].from.date) {
        openStatusString = `Vi öppnar kl. ${formatTime(nextWeek[0].from.string)} idag.`;
    } else if (now < nextWeek[0].to.date) {
        openStatusString = `Vi har öppet nu och stänger kl. ${formatTime(nextWeek[0].to.string)}.`;
    } else {
        const nextOpenDay = nextWeek.slice(1).filter(day => day.to.date && day.from.date)[0]

        if (nextWeek[0].reason) {
            openStatusString = `Vi har stängt på ${nextWeek[0].reason}.`;
        } else if (nextWeek[0].to.string && !nextWeek[0].reason) {
            openStatusString = `Vi har stängt för dagen.`;
        } else {
            openStatusString = `Vi har stängt idag.`;
        }

        openStatusString += `<br> Vi öppnar igen på ${nextOpenDay.name.singular} kl. ${formatTime(nextOpenDay.from.string)}`

    }


    const openStatusTag = document.querySelector("p.open-status");
    openStatusTag.innerHTML = openStatusString;
}

refreshDynamicOpenStatus();
