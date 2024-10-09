const deliverySection = document.querySelector(".delivery-section");
const zipInputField = deliverySection.querySelector(".input-container>input");
const zipSubmitButton = deliverySection.querySelector(".input-container>button");
const zipOutput = deliverySection.querySelector("#delivery-status-tag");

/**
 * Checks if the ZIP code is valid and if it is in the list of ZIP codes.
 */
const checkZIPCode = async () => {
    const data = await fetchData()
    const zipCodes = data.locationData.zip_codes;

    // Clear the output text and wait 0.1 seconds before refilling it to signal that the input has been received.
    zipOutput.textContent = "";

    setTimeout(() => {
        // Get the input value and remove all non-digit characters.
        const zip = zipInputField.value.replace(/\D/g, "");

        if (zip === "") {
            zipOutput.textContent = data.languageData.no_zip_code;
            return;
        }
        // Remove all non-digit characters from the ZIP code.
        if (zip.length !== 5) {
            zipOutput.textContent = data.languageData.zip_code_not_correct_length;
            return;
        }
        // Check if the ZIP code is in the list of ZIP codes that are deliverable.
        if (
            !zipCodes.map((zipObject) => {
                return zipObject.zip_code;
            }).includes(zip)
        ) {
            zipOutput.textContent = data.languageData.does_not_deliver.replace("${zip_code}", zip);
            return;
        }
        const price = zipCodes.filter((zipObject) => zipObject.zip_code === zip)[0].price;
        zipOutput.textContent = data.languageData.delivers.replace("${zip_code}", zip).replace("${price}", price);
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