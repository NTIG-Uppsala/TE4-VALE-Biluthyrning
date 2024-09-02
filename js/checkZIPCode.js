const deliverySection = document.querySelector(".delivery-section")
const zipInputField = deliverySection.querySelector(".input-container>input");
const zipSubmitButton = deliverySection.querySelector(".input-container>button");
const zipOutput = deliverySection.querySelector("#delivery-status-tag");
/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
const checkZIPCode = () => {
    const zip = zipInputField.value;

    
    zip.replace(/\D/g, "");
    
    if (zip === "") {
        zipOutput.textContent = "Du måste ange ett postnummer i rutan";
        return;
    }
    // Remove all non-digit characters from the ZIP code.
    if (zip.length !== 5) {
        zipOutput.textContent = "Postnumret måste vara 5 siffror";
        return;
    }
    // Check if the ZIP code is in the list of ZIP codes that are deliverable.
    if (!zipCodes.map((zipObject) => { return zipObject.zipCode }).includes(zip)) {
        zipOutput.textContent = "Vi kör inte ut till detta postnummer";
        return;
    }

    zipOutput.textContent = "Vi kör ut till detta postnummer för " + zipCodes.filter((zipObject) => zipObject.zipCode === zip)[0].price + " kr";
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
