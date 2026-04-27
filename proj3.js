// Profile Manager and Task List Application
function createProfileManager(){
let profile={
name:"",
email:""
}
// Simple email validation function
function validateEmail(email){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

return{
// Update a specific field in the profile
updateField(field,value){

if(!value.trim()){
return {success:false,message:`${field} is required`}
}
// Validate email format if the field is email
if(field==="email" && !validateEmail(value)){
return {success:false,message:"Invalid email format"}
}
// Update the profile with the new value
profile[field]=value

return {success:true,message:`${field} updated successfully`}
},

getProfile(){
return {...profile}
}

}

}
// Initialize the profile manager
const profileManager=createProfileManager()
document.querySelector("#profileForm").addEventListener("submit",function(e){

e.preventDefault()
// Get the input values for name and email
const name=document.querySelector("#name").value
const email=document.querySelector("#email").value

const result1=profileManager.updateField("name",name)
const result2=profileManager.updateField("email",email)

const message=document.querySelector("#profileMessage")
// Display error messages if validation fails
if(!result1.success){
message.textContent=result1.message
message.className="message"
return
}

if(!result2.success){
message.textContent=result2.message
message.className="message"
return
}
// If both updates are successful, display a success message
message.textContent="Profile saved successfully!"
message.className="message success"

})
// Task List Application
let tasks=[]

let savedJSON=""
// Add a new task to the list

function addTask(){

const input=document.querySelector("#taskInput")

const title=input.value.trim()

if(!title) return

const newTask={
id:Date.now(),
title:title,
completed:false,
created:new Date()
}

tasks.push(newTask)

input.value=""

renderTasks()

}

// Toggle the completion status of a task
document.querySelector("#addTaskBtn").addEventListener("click",addTask)

function toggleTask(id){

tasks=tasks.map(task =>
task.id===id ? {...task,completed:!task.completed} : task
)

renderTasks()

}

// Render the list of tasks to the DOM
function renderTasks(list=tasks){

const taskList=document.querySelector("#taskList")

taskList.innerHTML=list.map(task =>`

<li>

<span class="${task.completed ? 'task-complete' : ''}">

${task.title}

</span>

<button onclick="toggleTask(${task.id})">

${task.completed ? "Undo":"Complete"}

</button>

</li>

`).join("")

updateStats()

}

// Filter tasks to show only completed ones
document.querySelector("#showCompleted").addEventListener("click",()=>{

const filtered=tasks.filter(task => task.completed)

renderTasks(filtered)

})

// Show all tasks regardless of completion status
document.querySelector("#showAll").addEventListener("click",()=>{

renderTasks()

})

// Sort tasks by creation date, newest first
document.querySelector("#sortTasks").addEventListener("click",()=>{

const sorted=[...tasks].sort((a,b)=> new Date(b.created)-new Date(a.created))

renderTasks(sorted)

})

// Update the task statistics displayed to the user
function updateStats(){

if(tasks.length===0){
document.querySelector("#taskStats").textContent=""
return
}

const completed=tasks.reduce((count,task)=> task.completed ? count+1 : count,0)

const percent=Math.round((completed/tasks.length)*100)

document.querySelector("#taskStats").textContent=
`${completed}/${tasks.length} tasks completed (${percent}%)`

}

// Save the current tasks to a JSON string
document.querySelector("#saveJSON").addEventListener("click",()=>{

savedJSON=JSON.stringify(tasks)

alert("Tasks saved to JSON")

})

// Load tasks from the saved JSON string
document.querySelector("#loadJSON").addEventListener("click",()=>{

if(!savedJSON){
alert("Nothing saved yet")
return
}

tasks=JSON.parse(savedJSON)

renderTasks()

})

// Initial render of tasks when the page loads
// ===== USER FETCH FEATURES =====

// Random single user
async function getUser() {
  const display = document.getElementById("user-display");

  try {
    display.innerHTML = "<p>Loading data...</p>";

    const id = Math.floor(Math.random() * 10) + 1;

    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const user = await response.json();

    display.innerHTML = `
      <div class="user-card">
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
        <p>${user.address.city}</p>
      </div>
    `;

  } catch (error) {
    console.error(error);
    display.innerHTML = "<p class='error'>Unable to load user data</p>";
  }
}

// Multiple users
async function getUsers() {
  const display = document.getElementById("user-display");

  try {
    display.innerHTML = "<p>Loading data...</p>";

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Network error");
    }

    const users = await response.json();

    if (users.length === 0) {
      display.innerHTML = "<p>No results found</p>";
      return;
    }

    display.innerHTML = users.map(user => `
      <div class="user-card">
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>

        <button onclick="toggleDetails(${user.id})">
          See Details
        </button>

        <div id="details-${user.id}" class="hidden">
          <p>City: ${user.address.city}</p>
          <p>Phone: ${user.phone}</p>
          <p>Company: ${user.company.name}</p>
        </div>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    display.innerHTML = "<p class='error'>Unable to load data</p>";
  }
}
function toggleDetails(id) {
  const el = document.getElementById(`details-${id}`);
  el.classList.toggle("hidden");
}
// Event listeners for buttons
document.getElementById("loadUserBtn").addEventListener("click", getUser);
document.getElementById("loadUsersBtn").addEventListener("click", getUsers);document.getElementById("loadUserBtn").addEventListener("click", getUser);
document.getElementById("loadUsersBtn").addEventListener("click", getUsers);

function favoriteUser(name) {
  alert(`${name} added to favorites!`);
}