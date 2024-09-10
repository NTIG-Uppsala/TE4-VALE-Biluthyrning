
const locationSelect = document.querySelector(".select-container #location-select");
const localeSelect = document.querySelector(".select-container #language-select");

locationSelect.addEventListener("change", () => {
    const location = locationSelect.value;
    window.location = "../" + location;
});

localeSelect.addEventListener("change", () => {
    const windowPath = window.location.pathname.split("/");
    const location = windowPath[windowPath.length - 2] || "kiruna";
    const locale = localeSelect.value;
    window.location = window.location.pathname.replace("index.html", "") + "../../" + locale + "/" + location;
}); 