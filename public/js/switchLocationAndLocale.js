// Helper function to store the current scroll position
function storeScrollPosition() {
    sessionStorage.setItem("scrollPosition", window.scrollY);
}

// Helper function to restore the scroll position after redirect
function restoreScrollPosition() {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
        sessionStorage.removeItem("scrollPosition");
    }
}

// Switch locale on language option click
const localeDropdownContent = document.getElementById("locale-dropdown-content");
const languageContainers = localeDropdownContent.querySelectorAll(".language-container");

languageContainers.forEach(container => {
    container.addEventListener("click", async () => {
        const locale = container.getAttribute('data-value');

        // Set the currency based on the selected locale
        let targetCurrency = 'SEK';  // Default currency is SEK
        if (locale === 'fi') {
            targetCurrency = 'EUR';
        } else if (locale === 'en') {
            targetCurrency = 'GBP'; // Example: setting to GBP for English
        } else if (locale === 'sv') {
            targetCurrency = 'SEK';  // Swedish locale uses SEK
        }

        // Update the dropdown UI to reflect the selected language
        let countryCode = locale === "en" ? "gb" : locale; // Example: "en" uses GB flag
        const dropDownHead = document.getElementById("locale-dropdown-head");
        dropDownHead.innerHTML = `
            <span class="fi fi-${countryCode}"></span>
            <span class="name">${container.querySelector('.name').textContent}</span> 
            <img src="../../assets/icons/icons8-expand-arrow-48.png" id="locale-dropdown-arrow" alt="down arrow" width="18">
        `;

        // Store the current scroll position before the redirect
        storeScrollPosition();

        // Get the current page path and location (e.g., "kiruna")
        const windowPath = window.location.pathname.split("/");
        const location = windowPath[windowPath.length - 2] || "kiruna";

        // Redirect to the correct language version of the page
        window.location = window.location.pathname.replace("index.html", "") + "../../" + locale + "/" + location;

        // After redirect, update the car prices to match the selected currency
        await updateCarPrices(targetCurrency);
    });
});

// After page load, restore scroll position (useful when returning from redirects)
window.addEventListener("load", restoreScrollPosition);