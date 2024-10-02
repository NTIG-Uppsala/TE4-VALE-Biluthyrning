const deliverySection = document.querySelector(".delivery-section");
const zipInputField = deliverySection.querySelector(".input-container>input");
const zipSubmitButton = deliverySection.querySelector(".input-container>button");
const zipOutput = deliverySection.querySelector("#delivery-status-tag");
const language = document.querySelector("#lang").textContent;
const city = document.querySelector("#location").textContent.trim(); // Ensure no extra spaces

// Normalize city names to match localizationData keys
const normalizedCity = city.toLowerCase();

// Get the data for the current language and location
const dataZIP = localizationData[language][normalizedCity];

// Determine the correct list of ZIP codes based on the city
const zipCodes = normalizedCity === "kiruna" ? zipCodesKiruna : zipCodesLulea;

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
            zipOutput.textContent = dataZIP.lang.no_zip_code;
            return;
        }
        // Remove all non-digit characters from the ZIP code.
        if (zip.length !== 5) {
            zipOutput.textContent = dataZIP.lang.zip_code_not_correct_length;
            return;
        }
        // Check if the ZIP code is in the list of ZIP codes that are deliverable.
        if (
            !zipCodes.map((zipObject) => {
                return zipObject.zipCode;
            }).includes(zip)
        ) {
            zipOutput.textContent = dataZIP.lang.does_not_deliver.replace("${zip_code}", zip);
            return;
        }
        const price = zipCodes.filter((zipObject) => zipObject.zipCode === zip)[0].price;
        zipOutput.textContent = dataZIP.lang.delivers.replace("${zip_code}", zip).replace("${price}", price);
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