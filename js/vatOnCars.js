const buttonContainer = document.querySelector(
    ".our-cars-section>.vat-container"
);

const vat = 1.25;

const prices = Array.from(
    document.querySelectorAll(".our-cars-section .price")
);

const pricesVatIncluded = prices.map(
    (price) => parseInt(price.textContent).toFixed(0) + " kr"
);
const pricesVatExcluded = prices.map(
    (price) => (parseInt(price.textContent) / vat).toFixed(0) + " kr"
);


Array.from(buttonContainer.children).forEach((button, index) => {
    button.addEventListener("click", () => {
        if (buttonContainer.children[1].classList.contains("active")) {
            prices.forEach((price, index) => {
                price.textContent = pricesVatIncluded[index];
            });
        } else {
            prices.forEach((price, index) => {
                price.textContent = pricesVatExcluded[index];
            });
        }
        Array.from(buttonContainer.children).forEach((button) =>
            button.classList.remove("active")
        );
        button.classList.add("active");
    });
});
