// Function to display error messages on the page
function displayError(errorMessage) {
  const errorContainer = document.getElementById("errorContainer");
  // errorContainer.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
  if (errorMessage) {
    errorContainer.innerHTML = `<p style="color: red; font-weight: bold; background-color: #ff5">Error: ${errorMessage}</p>`;
    const errorbox = document.getElementById("errorContainer");
    errorbox.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    errorContainer.innerHTML = ''; // Clear the error message
  }
}




// Function to fetch employee data from the server
function fetchEmployees() {
    fetch("./app/employee_management.php", {
        method: "POST",
        body: JSON.stringify({ fetchEmployees: true }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => console.error(error));
}


document.getElementById("addEmployeeForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target;
  const firstName = form.querySelector("#first_name").value;
  const lastName = form.querySelector("#last_name").value;
  const email = form.querySelector("#email").value;
  const employeeId = form.querySelector("#employee_id").value;
  const departmentName = form.querySelector("#department_name").value;

  // Create a JSON object with the employee and department data
  const data = {
      addEmployee: true,
      first_name: firstName,
      last_name: lastName,
      email: email,
      employee_id: employeeId,
      department_name: departmentName
  };
  console.log(JSON.stringify(data)); // Check this output in the console

  // Send the data to your PHP script using a fetch request
  fetch("./app/employee_management.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(data => {

      ////////// color change on success /////
      const messageContainer = document.getElementById("addEmployeeForm");
      const successMessage = document.getElementById("successMessage"); ///// success message container /////
      // const originalColor = messageContainer.style.backgroundColor;



      if (data.error) {
        // Handle the error (e.g., display an error message)
        console.error(data.error);
        displayError(data.error);
      } else {
        // Handle the success case (e.g., display a success message)
        displayError("");

        /////////// color change on success /////
        messageContainer.style.backgroundColor = "green";
        messageContainer.classList.add("color-transition-original");



        // alert("Employee added successfully");
        // location.reload();
        form.reset();
        successMessage.style.display = "block"; ///// show the success message /////
        // fetchEmployees();
      }

        ////////// color change on success /////
        setTimeout(() => {
        // messageContainer.classList.remove("color-transition-original");
        messageContainer.style.backgroundColor = "";
        successMessage.style.display = "none";  ///// Hide the success message /////
        }, 4000); 
    
  })
  .catch(error => {
      // Handle network errors here
      console.error(error);
      // Display an appropriate error message
      displayError("An error occurred while processing the request.");
  });
  
});

// Function to handle searching for employees
/////// OLD FORM CODE without ability to press ENTER to initiate search ////////////

// document.getElementById("searchEmployee").addEventListener("click", function() {
//   const searchName = document.getElementById("search_name").value;
//   document.querySelector("#empl-list-title").style.display = "inline";

//   fetch("./app/employee_management.php", {
//       method: "POST",
//       body: JSON.stringify({ 
//           searchEmployee: true,
//           search_name: searchName
//       }),
//       headers: {
//           "Content-Type": "application/json"
//       }
      
//   })
//   .then(response => response.json())
//   .then(data => {
//     displayData(data);

//     // Scroll to the search results
//     const searchResults = document.getElementById("employeeList");
//     searchResults.scrollIntoView({ behavior: "smooth", block: "start" });
//   })
//   .catch(error => console.error(error));
// });
///////////////////////////

/////// new code with ability to press ENTER to initiate search ////////////

function searchEmployee(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const searchName = document.getElementById("search_name").value;
  document.querySelector("#empl-list-title").style.display = "inline";

  fetch("./app/employee_management.php", {
    method: "POST",
    body: JSON.stringify({ 
        searchEmployee: true,
        search_name: searchName
    }),
    headers: {
        "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    displayData(data);

    // Scroll to the search results
    const searchResults = document.getElementById("employeeList");
    searchResults.scrollIntoView({ behavior: "smooth", block: "start" });
  })
  .catch(error => console.error(error));
}

document.getElementById("searchForm").addEventListener("submit", searchEmployee);

document.getElementById("search_name").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    searchEmployee(event);
  }
});

//////////////////////


/////////////////////----------------table ----------------------
// Function to display employee data on the web page as a table

let currentSortColumn = null;
let isAscending = true;
function displayData(data) {
  console.log(data);
  const display = document.querySelector("#employeeList");
  display.innerHTML = "";

  if (!data) {
    display.innerHTML = "No data available.";
    return;
  }

  if (data.length === 0) {
    display.innerHTML = "No data available.";
    return;
  }

  const table = document.createElement("table");
  table.classList.add("employee-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "▼ EMPLOYEE ID",
    "▼ Name",
    "▼ Last Name",
    "▼ Email",
    "▼ Department",
  ];

  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.dataset.columnIndex = index; // Store the column index for sorting
    th.addEventListener("click", () => sortTable(index)); // Add a click event listener for sorting
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach((employee,index) => {
    const row = document.createElement("tr");
    row.classList.add("employee" + index);
    row.addEventListener("click",()=>{
      console.log("hello", employee['employee_id']);
      const idForm = new FormData();
      const url = "./app/profile.php?id="+employee['employee_id'];
      const data = idForm.append("id",employee['employee_id']);
      fetch(url,{
        method: "POST",
        data: data
      }); 

      window.location.href = "./profile.html?id="+employee['employee_id'];
    })
    const columns = [
      "employee_id",
      "first_name",
      "last_name",
      "email",
      "department_name",
    ];
    columns.forEach((columnKey) => {
      const cell = document.createElement("td");
      cell.textContent = employee[columnKey];
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  display.appendChild(table);
}

// Call the function to fetch employee data when the page loads



// ----------------------sort table---------------------
function sortTable(columnIndex) {
  const table = document.querySelector(".employee-table");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const isNumeric = columnIndex < 0; // Assuming the Employee ID column is numeric

  rows.sort((a, b) => {
    const aValue = isNumeric
      ? parseInt(a.cells[columnIndex].textContent)
      : a.cells[columnIndex].textContent;
    const bValue = isNumeric
      ? parseInt(b.cells[columnIndex].textContent)
      : b.cells[columnIndex].textContent;

    return aValue.localeCompare(bValue);
  });

  // Reverse the order if it was already sorted in ascending order
  if (currentSortColumn === columnIndex && isAscending) {
    rows.reverse();
    isAscending = false;
  } else {
    isAscending = true;
  }

  // Remove existing rows from the table
  tbody.innerHTML = "";

  // Append sorted rows to the table body
  rows.forEach((row) => tbody.appendChild(row));

  // Update the current sort column
  currentSortColumn = columnIndex;
}
// fetchEmployees();
///////////////////----------------------end table----------------------