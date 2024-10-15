const login = async (event) => {
    event.preventDefault(); // Prevent traditional form submission
    
    const data = await fetchData();

    const password = document.querySelector("input[type='password']").value;

    try {
        const response = await fetch("/POST/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
