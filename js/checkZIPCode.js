/**
 * Represents the input field for the ZIP code.
 * @type {HTMLElement}
 */
const zipInputField = document.querySelector("#zip");

/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
zipInputField.addEventListener("input", function () {
    const zip = zipInputField.value;
    // Remove all non-digit characters from the ZIP code.
    zip.replace(/\D/g, "");
    if (zip.length !== 5) {
        zipInputField.setCustomValidity("Postnummeret måste vara 5 siffror.");
        return;
    }
    // Check if the ZIP code is in the list of ZIP codes that are deliverable.
    if (!zipCodes.includes(zip)) {
        zipInputField.setCustomValidity(
            "Vi levererar inte till detta postnummer."
        );
        return;
    }
    zipInputField.setCustomValidity("Vi levererar till detta postnummer.");
});
