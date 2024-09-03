const buttons = document.querySelectorAll(
    ".our-cars-section>.vat-container>button"
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

const setVatIncluded = () => {
    prices.forEach((price, index) => {
        price.textContent = pricesVatIncluded[index];
    });
}
const setVatExcluded = () => {
    prices.forEach((price, index) => {
        price.textContent = pricesVatExcluded[index];
    });
}

buttons.forEach((button, index) => {
    button.classList.add("button" + index);

    button.addEventListener("click", (event) => {
        if (event.target.classList.contains("active")) {
            return;
        };

        buttons.forEach((button) => button.classList.remove("active"));

        event.target.classList.add("active");

        if (button.classList.contains("button0")) {
            setVatIncluded();
        } else {
            setVatExcluded();
        };
    });
});