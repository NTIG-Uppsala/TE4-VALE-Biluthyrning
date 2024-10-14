document.querySelector("button");

const login = async () => {
   const password = document.querySelector("input").value;
   const response = await fetch("/POST/login", {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
       },
       body: JSON.stringify({ password }),
   });
};

document.querySelector("button").addEventListener("click", login);