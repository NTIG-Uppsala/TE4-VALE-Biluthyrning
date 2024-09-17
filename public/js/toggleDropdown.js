const openDropdown = () => {
	document.getElementById("redirect-dropdown-arrow").style.transform = "rotate(180deg) scaleX(-1)";
	const dropdown_content = document.getElementById("redirect-dropdown-content");
	dropdown_content.style.visibility = "visible";

	const handleEscapePress = (event) => {
	    if (event.key == "Escape") {
			document.body.removeEventListener("keydown", handleEscapePress);
			document.body.removeEventListener("click", handleClickOutsideDropdown);
            closeDropdown();
        }
	};
	document.body.addEventListener("keydown", handleEscapePress);

  	const handleClickOutsideDropdown = (event) => {
    	if (!dropdown_content.contains(event.target)) {
			document.body.removeEventListener("click", handleClickOutsideDropdown);
			document.body.removeEventListener("keydown", handleEscapePress);
			closeDropdown();
    	}
	};

	requestAnimationFrame(() => 
		document.body.addEventListener("click", handleClickOutsideDropdown)
	);
}
	              
const closeDropdown = () => {
	document.getElementById("redirect-dropdown-content").style.visibility = "hidden";
	document.getElementById("redirect-dropdown-arrow").style.transform = "rotate(0deg) scaleX(-1)";
}

const toggleDropdown = () => { // TODO: If highlighting text in dropdown it disappears, and trying to then toggle the dropdown doesn't work
	if (document.getElementById("redirect-dropdown-content").style.getPropertyValue('visibility') == "visible") {
		closeDropdown()
	}
    else {
		openDropdown()
	}
}

// Prevent highlighting text in dropdown head. Not optimal currently.
requestAnimationFrame(() => {
	document.body.querySelector(".redirect-dropdown-head").addEventListener('mousedown', function(event) {
		if (event.detail > 1) {
			event.preventDefault();
		}
	}, false);
});