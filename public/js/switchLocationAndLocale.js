const locationSelect = document.querySelector(".redirect-dropdowns #location-select");
const localeSelect = document.getElementById("locale-dropdown-content");

// This will update the location when a new location is chosen
if (locationSelect) {
    locationSelect.addEventListener("change", () => {
        const location = locationSelect.value;
        window.location = "../" + location;
    });
}

// Switch locale on language option click
const languageContainers = localeSelect.querySelectorAll(".language-container");
languageContainers.forEach(container => {
    container.addEventListener("click", () => {
        // Get the selected value from the data-value attribute
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
            <span class="language-name">${container.querySelector('.language-name').textContent}</span> 
			<img src="../../assets/icons/icons8-expand-arrow-48.png" id="locale-dropdown-arrow" alt="down arrow" width="18">
        `;

        // Redirect based on current location
        const windowPath = window.location.pathname.split("/");
        const location = windowPath[windowPath.length - 2] || "kiruna"; // Default location if not found
        window.location = window.location.pathname.replace("index.html", "") + "../../" + locale + "/" + location;
    });
});