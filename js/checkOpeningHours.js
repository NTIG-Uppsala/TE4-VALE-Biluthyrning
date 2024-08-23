
const dropdown = document.querySelector(".opening-hours-dropdown");
const dropdownArrow = document.getElementById("dropdown-arrow");
dropdownArrow.setAttribute("data-state", "closed");

dropdownArrow.addEventListener("click", () => {
    dropdown.classList.toggle("open-dropdown");

    console.log(dropdownArrow.getAttribute("data-state"));
    if (dropdownArrow.getAttribute("data-state") === "closed") {
        dropdownArrow.setAttribute("data-state", "open");
        dropdownArrow.style.transform = "rotate(180deg)";
    } else {
        dropdownArrow.setAttribute("data-state", "closed");
        dropdownArrow.style.transform = "rotate(0deg)";
    }
});

let openHoursString = ""

Object.keys(openHours).forEach(key => {
    const day = openHours[key];

    let dayString = ""

    dayString += day.name + " "
    if(day.from || day.to) {
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


const openStatusTag = document.querySelector("p.open-status");

const now = new Date();