document.querySelector(".hamburger-menu").addEventListener("click", () => {
    // Get the dropdown menu
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Toggle the display of the dropdown menu
    dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";

    document.addEventListener("click", onClickHamburgerClose);
    document.addEventListener("keydown", onKeyPressHamburgerClose);
});

const onClickHamburgerClose = (event) => {
    // Get the dropdown menu
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const hamburgerMenu = document.querySelector(".hamburger-menu");

    // If the dropdown menu is clicked
    if (event.target === hamburgerMenu) {
        return;
    }

    /* If the dropdown menu is not clicked,
    * hide the dropdown menu
    */
    dropdownMenu.style.display = "none";

    document.removeEventListener("keydown", onKeyPressHamburgerClose);
    document.removeEventListener("click", onClickHamburgerClose);
};

const onKeyPressHamburgerClose = (event) => {
    if (event.key == "Escape") {
        const dropdownMenu = document.querySelector(".dropdown-menu");
        dropdownMenu.style.display = "none";

        document.removeEventListener("keydown", onKeyPressHamburgerClose);
        document.removeEventListener("click", onClickHamburgerClose);
    }
};