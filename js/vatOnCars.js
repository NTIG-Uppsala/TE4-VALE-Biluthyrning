// Get the buttons
const buttons = document.querySelectorAll("#vat-button, #no-vat-button");

// VAT is 25%
const VAT_RATE = 1.25;

// Get all the prices from the table
const prices = Array.from(document.querySelectorAll(".our-cars-table .price"));

// Calculate prices with and without VAT

// Gets the integer value of the price in each cell of the table
const priceValues = prices.map((price) => parseInt(price.textContent));

// Rounds the price to the nearest whole number and adds "kr" to the end
const pricesWithVat = priceValues.map((price) => price.toFixed(0) + " kr");

// Divides the price by the VAT rate and rounds to the nearest whole number and adds "kr" to the end
const pricesWithoutVat = priceValues.map(
    (price) => (price / VAT_RATE).toFixed(0) + " kr"
);

// Function to set prices to either with VAT or without VAT
const setPricesWithVat = () => {
    prices.forEach((price, index) => {
        price.textContent = pricesWithVat[index];
    });
};

const setPricesWithoutVat = () => {
    prices.forEach((price, index) => {
        price.textContent = pricesWithoutVat[index];
    });
};

// Function to handle button clicks
const handleButtonClick = (button) => {
    // If the button is already active, do nothing
    if (button.classList.contains("active")) {
        return;
    }

    // Remove the active class from all buttons
    buttons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to the clicked button
    button.classList.add("active");

    // Set prices based on the button clicked
    if (button.id === "vat-button") {
        setPricesWithVat();
    } else {
        setPricesWithoutVat();
    }
};

// Attach event listeners to buttons
buttons.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
});
