const deliverySection = document.querySelector(".delivery-section");
const zipInputField = deliverySection.querySelector(".input-container>input");
const zipSubmitButton = deliverySection.querySelector(".input-container>button");
const zipOutput = deliverySection.querySelector("#delivery-status-tag");
/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
const checkZIPCode = () => {
    // Clear the output text and wait 0.1 seconds before refilling it to signal that the input has been received.
    zipOutput.textContent = "";

    setTimeout(() => {
        // Get the input value and remove all non-digit characters.
        const zip = zipInputField.value.replace(/\D/g, "");

        if (zip === "") {
            zipOutput.textContent = "Du måste ange ett postnummer i rutan";
            return;
        }
        // Remove all non-digit characters from the ZIP code.
        if (zip.length !== 5) {
            zipOutput.textContent = "Postnumret måste vara fem siffror";
            return;
        }
        // Check if the ZIP code is in the list of ZIP codes that are deliverable.
        if (
            !zipCodes.map((zipObject) => {
                return zipObject.zipCode;
            }).includes(zip)
        ) {
            zipOutput.textContent = `Vi kör inte ut till postnummer ${zip}`;
            return;
        }

        zipOutput.textContent = `Vi kör ut till postnummer ${zip} för ${zipCodes.filter((zipObject) => zipObject.zipCode === zip)[0].price
            } kr`;
    }, 100);
};

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
