// This creates an element that is used by tests to indicate that all JavaScript has completed loading.
const checkDiv = document.createElement("div");
checkDiv.setAttribute("hidden", "true");
checkDiv.setAttribute("id", "checkJsCompleted");
document.body.appendChild(checkDiv);
