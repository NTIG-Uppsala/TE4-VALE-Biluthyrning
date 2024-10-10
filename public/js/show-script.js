// All elements with the class 'script' are by default hidden. This script removes the class so that the elements are visible.
Array.from(document.querySelectorAll('.script')).forEach((element) => {
   element.classList.remove('script');
});