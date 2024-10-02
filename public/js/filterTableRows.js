function searchTable() {
    // Declare variables
    var input, filter, table, tr, td, i, textValue;
    input = document.getElementById("car-search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("our-cars-table");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        textValue = td.textContent || td.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  