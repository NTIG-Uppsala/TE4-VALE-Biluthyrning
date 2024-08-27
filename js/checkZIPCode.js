/**
 * Represents the input field for the ZIP code.
 * @type {HTMLElement}
 */
const zipInputField = document.querySelector("#zip-input");
/**
 * Represents the submit button for the ZIP code.
 * @type {HTMLElement}
 * */
const zipSubmitButton = document.querySelector("#zip-button");
/**
 * Represents the output field for the ZIP code.
 * @type {HTMLElement}
 * */
const zipOutput = document.querySelector("#zip-response");
/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
function checkZIPCode() {
    const zip = zipInputField.value;
    if (zip === "") {
        zipOutput.textContent = "Du måste ange ett postnummer i rutan.";
        return;
    }
    // Remove all non-digit characters from the ZIP code.
    zip.replace(/\D/g, "");
    if (zip.length !== 5) {
        zipOutput.textContent = "Postnumret måste vara 5 siffror.";
        return;
    }
    // Check if the ZIP code is in the list of ZIP codes that are deliverable.
    if (!zipCodes.includes(zip)) {
        zipOutput.textContent = "Vi levererar inte till detta postnummer.";
        return;
    }
    zipOutput.textContent = "Vi levererar till detta postnummer.";
}
// Event listeners for the submit button and the input field.
zipSubmitButton.addEventListener("click", function () {
    checkZIPCode();
});

zipInputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkZIPCode();
    }
});

zipInputField.addEventListener("blur", function () {
    checkZIPCode();
});
