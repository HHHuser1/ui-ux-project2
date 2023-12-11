
const searchParams = new URLSearchParams(window.location.search);
// console.log(searchParams.has('id')); // true

let paramID;
for (const param of searchParams) {
  // console.log(param);
  paramID = param[1];
}

// console.log(paramID);
const url = `./app/profile.php?id=${paramID}`;

async function fetchSingleEmployee(url){
const response = await fetch(url);
// console.log("this is response ",response)

const data = await response.json();
generateProfile(data);
console.log(data);
}

fetchSingleEmployee(url);

const main = document.querySelector(".profile");


function generateProfile(dataEmployee){
dataEmployee.map((data)=>{

  main.innerHTML = `
  <h1>Profile</h1>
  <article>
    <div class='left'>
      <img src='https://static.vecteezy.com/system/resources/previews/005/972/881/original/business-team-employees-user-icon-free-vector.jpg'></img>
    </div>
    <div class='right'>
      <label>Employee ID</label>
      <p>${data.employee_id}</p>
      <label>First Name</label>
      <p>${data.first_name}</p>
      <label>Last Name</label>
      <p>${data.last_name}</p>
      <label>Email</label>
      <p>${data.email}</p>
      <label>Department</label>
      <p>${data.department_name}</p>
    </div>
  </article>
  `
})
}