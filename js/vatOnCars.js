
const buttonContainer = document.querySelector('.our-cars-section>.vat-container');

const vat = 1.25;

const prices = document.querySelectorAll('.our-cars-section>.price');
const pricesVatIncluded = prices.map(price => price.textContent.toFixed(2));
const pricesVatExcluded = prices.map(price => (price.textContent / vat).toFixed(2));



buttonContainer.addEventListener("change", () => {
    if (buttonContainer.children[1].classList.contains("active")) {
        prices.forEach((price, index) => {
            price.textContent = pricesVatIncluded[index];
        });
    } else {
        prices.forEach((price, index) => {
            price.textContent = pricesVatExcluded[index];
        });
    }
});

buttonContainer.children.forEach((button, index) => {
    button.addEventListener("click", () => {
        buttonContainer.children.forEach(button => button.classList.remove("active"));
        button.classList.add("active");
    });
});