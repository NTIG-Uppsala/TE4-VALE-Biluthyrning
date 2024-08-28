
const zipInputField = document.querySelector("#zip-input");
const zipSubmitButton = document.querySelector("#zip-button");
const zipOutput = document.querySelector("#zip-response");
/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
const checkZIPCode = () => {
    const zip = zipInputField.value;
    
    zip.replace(/\D/g, "");
    
    if (zip === "") {
        zipOutput.textContent = "Du måste ange ett postnummer i rutan.";
        return;
    }
    // Remove all non-digit characters from the ZIP code.
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
zipSubmitButton.addEventListener("click", () => {
    checkZIPCode();
});
zipInputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        checkZIPCode();
    }
});
zipInputField.addEventListener("blur", () => {
    checkZIPCode();
});
