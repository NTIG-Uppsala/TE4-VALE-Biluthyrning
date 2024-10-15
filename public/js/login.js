const login = async (event) => {
    const data = await fetchData();

    event.preventDefault(); // Prevent traditional form submission

    const password = document.querySelector("input[type='password']").value;

    try {
        const response = await fetch("/POST/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Pass CSRF token as a header for security
                "CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            // Handle success (e.g., redirect or show success message)
            window.location.href = "/admin";
        } else {
            // Handle error (e.g., incorrect password)
            const error = await response.json();
            alert(error.message || data.languageData["login_page_client_error"]);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert(data.languageData["login_page_server_error"]);
    }
};

document.querySelector("button").addEventListener("click", login);
