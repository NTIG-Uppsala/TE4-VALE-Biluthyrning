
const submitForm = async (event) => {
    event.preventDefault(); // Prevent traditional form submission

    // Gets the language data mainly
    const data = await fetchData();

    // The newly updated data from the admin panel
    const updatedData = {};
    Array.from(document.querySelectorAll("form>input"))
        .filter((input) => {
            return input.placeholder !== input.value;
        })
        .forEach((input) => {
            updatedData[input.dataset.key] = input.value;
        });

    if (Object.keys(updatedData).length === 0) {
        alert("No data changed");
        return;
    }

    try {
        const response = await fetch("/POST/set-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Pass CSRF token as a header for security
                // "CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            // Handle success (e.g., redirect or show success message)
            let alertString = "Updated: \n\n";
            for (const key in updatedData) {
                alertString += ` - ${key}: ${data.locationData[key]} -> ${updatedData[key]}\n\n`;
            }
            alert(alertString);

        } else {
            const error = await response.json();
            alert(error.message || data.languageData["login_page_client_error"]);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert(data.languageData["login_page_server_error"]);
    }
};

document.querySelectorAll("form>button[type='submit']").forEach((button) => {
    button.addEventListener("click", submitForm);
});

const logOut = async (redirectTo = "/") => {
    const response = await fetch("/POST/logout", { method: "POST" });

    if (response.ok) {
        window.location.href = redirectTo;
    }
};