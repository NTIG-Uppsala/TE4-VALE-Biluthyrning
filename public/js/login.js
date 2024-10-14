const login = async (event) => {
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
            alert(error.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again later.");
    }
};

document.querySelector("button").addEventListener("click", login);
