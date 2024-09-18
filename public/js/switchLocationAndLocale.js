// Switch location on location option click
const locationDropdownContent = document.getElementById("location-dropdown-content");
const locationContainers = locationDropdownContent.querySelectorAll(".location-container");
locationContainers.forEach(container => {
    container.addEventListener("click", () => {
        const location = container.getAttribute('data-value');

        // Give the user confirmation that the location has been changed before redirecting
        const dropDownHead = document.getElementById("location-dropdown-head");
        dropDownHead.innerHTML = `
            <span class="name">${container.querySelector('.name').textContent}</span> 
			<img src="../../assets/icons/icons8-expand-arrow-48.png" id="location-dropdown-arrow" alt="down arrow" width="18">
        `;

        window.location = "../" + location;
    });
});


// Switch locale on language option click
const localeDropdownContent = document.getElementById("locale-dropdown-content");
const languageContainers = localeDropdownContent.querySelectorAll(".language-container");
languageContainers.forEach(container => {
    container.addEventListener("click", () => {
        const locale = container.getAttribute('data-value');
        
        // Handle exceptions for the country code
        let countryCode = "";
        if (locale === "en") {
            countryCode = "gb";
        }
        else {
            countryCode = locale;
        }

        // Give the user confirmation that the language has been changed before redirecting
        const dropDownHead = document.getElementById("locale-dropdown-head");
        dropDownHead.innerHTML = `
            <span class="fi fi-${countryCode}"></span> <!--Flag icon. The country is specified through fi-xx, where xx is replaced with the country code.-->
            <span class="name">${container.querySelector('.name').textContent}</span> 
			<img src="../../assets/icons/icons8-expand-arrow-48.png" id="locale-dropdown-arrow" alt="down arrow" width="18">
        `;

        // Redirect based on current location
        const windowPath = window.location.pathname.split("/");
        const location = windowPath[windowPath.length - 2] || "kiruna"; // Default location if not found
        window.location = window.location.pathname.replace("index.html", "") + "../../" + locale + "/" + location;
    });
});