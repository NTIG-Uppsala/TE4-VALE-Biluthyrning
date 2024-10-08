// Filter table rows based on user input
const searchTable = () => {
    // Declare variables
    const input = document.querySelector("#car-search-input");
    const filter = input.value.toUpperCase();
    const table = document.querySelector("#our-cars-table");
    const tr = table.document.querySelectorAll("tr");

    // Loop through all table rows, and hide those who don't match the search query
    Array.from(tr).forEach((row) => {
        const td = row.querySelector("td");
        const textValue = td.textContent || td.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
};
