// Get the buttons
const buttons = document.querySelectorAll("#vat-button, #no-vat-button");

// The value added tax (swe: moms) is 25%
const vat = 1.25;

// Get all the prices from the table
const priceDOMs = Array.from(document.querySelectorAll(".our-cars-table .price"));

// Gets the integer value of the price in each cell of the table
const pricesAsNumbers = priceDOMs.map((price) => parseInt(price.textContent));

// Takes all the prices and assume that they're already with VAT
const pricesWithVat = pricesAsNumbers.map(
    (price) => price.toFixed(0) + " kr"
);

// Takes all the prices and divides them by the VAT rate to get the price without VAT
const pricesWithoutVat = pricesAsNumbers.map(
    (price) => (price / vat).toFixed(0) + " kr"
);

const displayPricesWithVat = () => {
    // Sets all the price elements in the table to the prices with VAT
    priceDOMs.forEach((price, index) => {
        price.textContent = pricesWithVat[index];
    });
};

const displayPricesWithoutVat = () => {
    // Sets all the price elements in the table to the prices without VAT
    priceDOMs.forEach((price, index) => {
        price.textContent = pricesWithoutVat[index];
    });
};

const onButtonClick = (button) => {
    // If the button is already active, do nothing
    if (button.classList.contains("active")) {
        return;
    }

    // Remove the active class from all buttons to make sure both can't be active at the same time
    buttons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to the clicked button
    button.classList.add("active");

    // Set prices based on the button clicked
    if (button.id === "vat-button") {
        displayPricesWithVat();
    } else {
        displayPricesWithoutVat();
    }
};

// Attach event listeners to buttons
buttons.forEach((button) => {
    button.addEventListener("click", () => onButtonClick(button));
});
