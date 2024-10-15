
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
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            // Success message
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

// Add event listener to all submit buttons
document.querySelectorAll("form>button[type='submit']").forEach((button) => {
    button.addEventListener("click", submitForm);
});

// Log out
const logOut = async () => {
    return fetch("/POST/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
};

// Add event listener to log out buttons
document.querySelectorAll(".log-out-button").forEach((button) => {
    button.addEventListener("click", () => {
        logOut().then(() => {
            window.location.href = button.dataset.href;
        });
    });
});