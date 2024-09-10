
const locationSelect = document.querySelector(".select-container #location-select");
const localeSelect = document.querySelector(".select-container #language-select");

locationSelect.addEventListener("change", () => {
    const location = locationSelect.value;
    window.location = "../" + location;
});

localeSelect.addEventListener("change", () => {
    
});