const sortTable = (column) => {

    const updateIndicator = (updateColumn) => {
        document.getElementById(`ascending-${updateColumn}`).style.display = "none";
        document.getElementById(`neutral-${updateColumn}`).style.display = "inline";
        document.getElementById(`descending-${updateColumn}`).style.display = "none";
    }

    var table, rows, switching, i, x, y, shouldSwitch, direction, switchcount = 0;

    // Get the HTML table
    table = document.getElementById("our-cars-table");

    switching = true;

    // By default, set the direction to ascending
    direction = "ascending";

    while (switching) {
        // Stop looping after this iteration
        switching = false;
        // Get all rows from the HTML table
        rows = table.rows;

        // Loop skips the header row
        for (i = 1; i < (rows.length - 1); i++) {
            // By default, assume no switching is needed
            shouldSwitch = false;
            // Get and store current row in x and the next row in y
            x = rows[i].getElementsByTagName("TD")[column];
            y = rows[i + 1].getElementsByTagName("TD")[column];

            // If the direction is ascending, switch if x is greater than y
            if (direction == "ascending") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    document.getElementById(`ascending-${column}`).style.display = "inline";
                    document.getElementById(`neutral-${column}`).style.display = "none";
                    document.getElementById(`descending-${column}`).style.display = "none";
                    if (column == 0) {
                        updateIndicator(1);
                        updateIndicator(2);
                    }
                    else if (column == 1) {
                        updateIndicator(0);
                        updateIndicator(2);
                    }
                    else if (column == 2) {
                        updateIndicator(0);
                        updateIndicator(1);
                    }
                    break; // Exit the for-loop
                }
            }
            // If the direction is descending, switch if x is less than y
            else if (direction == "descending") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    document.getElementById(`descending-${column}`).style.display = "inline";
                    document.getElementById(`neutral-${column}`).style.display = "none";
                    document.getElementById(`ascending-${column}`).style.display = "none";

                    break; // Exit the for-loop
                }
            }
        }
        // If a switch should be made
        if (shouldSwitch) {
            // Switch the two rows, x and y
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
        // If a switch has been made, run the while loop again
        else if (switchcount == 0 && direction == "ascending") {
            direction = "descending";
            switching = true;
        }
    }
}



// Vi måste get element by id och ändra {{lang.sort_decending}} till 
// {{lang.sort_ascending}} och vice versa beroende på vilken riktning vi sorterar i.