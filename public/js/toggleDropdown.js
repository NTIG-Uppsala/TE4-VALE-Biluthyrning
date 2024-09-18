const openDropdown = (dropdownContentId, dropdownArrowId) => {
	document.getElementById(dropdownArrowId).style.transform = "rotate(180deg) scaleX(-1)";
	const dropdownContent = document.getElementById(dropdownContentId);
	dropdownContent.style.visibility = "visible";

	const handleEscapePress = (event) => {
	    if (event.key == "Escape") {
			document.body.removeEventListener("keydown", handleEscapePress);
			document.body.removeEventListener("click", handleClickOutsideDropdown);
            closeDropdown(dropdownContentId, dropdownArrowId);
        }
	};
	document.body.addEventListener("keydown", handleEscapePress);

  	const handleClickOutsideDropdown = (event) => {
    	if (!dropdownContent.contains(event.target)) {
			document.body.removeEventListener("click", handleClickOutsideDropdown);
			document.body.removeEventListener("keydown", handleEscapePress);
			closeDropdown(dropdownContentId, dropdownArrowId);
    	}
	};

	requestAnimationFrame(() => 
		document.body.addEventListener("click", handleClickOutsideDropdown)
	);
}
	              
const closeDropdown = (dropdownContentId, dropdownArrowId) => {
	document.getElementById(dropdownContentId).style.visibility = "hidden";
	document.getElementById(dropdownArrowId).style.transform = "rotate(0deg) scaleX(-1)";
}

const toggleDropdown = (type) => { // TODO: If highlighting text in dropdown it disappears, and trying to then toggle the dropdown doesn't work
	const dropdownContentId = type + "-dropdown-content";
	const dropdownArrowId = type + "-dropdown-arrow";
	if (document.getElementById(dropdownContentId).style.getPropertyValue('visibility') == "visible") {
		closeDropdown(dropdownContentId, dropdownArrowId)
	}
    else {
		openDropdown(dropdownContentId, dropdownArrowId)
	}
}