/**
 * This file is loaded last on the website to check to give a signal to the tests that the website is fully loaded.
 * 
 * @type {HTMLDivElement}
 */
const checkDiv = document.createElement("div");
checkDiv.setAttribute("hidden", "true");
checkDiv.setAttribute("id", "checkOpeningHoursJsCompleted");
document.body.appendChild(checkDiv);
