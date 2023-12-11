
<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


require_once('./_includes/db_connect.php');

$id = isset($_GET['id']) ? $_GET['id'] : null;

// SQL query to fetch employee data along with department names
$query = "SELECT * FROM employees INNER JOIN departments ON employees.departmentID = departments.departmentID WHERE employees.employee_id = '$id' ";
         

$result = mysqli_query($link, $query);

if (!$result) {
    die("Query failed: " . mysqli_error($link));
}

$employeeData = array();

// Fetch and store employee data in an array
while ($row = mysqli_fetch_assoc($result)) {
    $employeeData[] = $row;
}

// Return the employee data as JSON
header('Content-Type: application/json');
echo json_encode($employeeData);

// Close the database connection
mysqli_close($link);
?>