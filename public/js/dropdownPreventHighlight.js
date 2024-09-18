/* Prevent highlighting text in all dropdown heads when double clicking. Not optimal currently.
* Should also prevent a user from dragging and highlighting text directly in the dropdown heads, but still 
* be able to highlight it when using ctrl+a or manually selecting for example the entire navbar text.
* This is the default behavior for dropdowns created with <select> and <option> elements.
* Currently, this solution prevents the default tab behavior for selecting items on the page.
*/ 

requestAnimationFrame(() => {
	document.body.querySelectorAll(".redirect-dropdown-head").forEach(head => {
		head.addEventListener('mousedown', function(event) {
			if (event.detail > 1) {
				event.preventDefault();
			}
		});
	}, false);
});