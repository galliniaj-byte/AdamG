//project manager
function createProfileManager(){
let profile={ name:"", email:"" }

function validateEmail(email){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

return{
updateField(field,value){
if(!value.trim()){
return {success:false,message:`${field} is required`}
}
if(field==="email" && !validateEmail(value)){
return {success:false,message:"Invalid email format"}
}
profile[field]=value
return {success:true,message:`${field} updated successfully`}
},
getProfile(){ return {...profile} }
}
}

const profileManager=createProfileManager()

document.querySelector("#profileForm").addEventListener("submit",function(e){
e.preventDefault()

const name=document.querySelector("#name").value
const email=document.querySelector("#email").value

const result1=profileManager.updateField("name",name)
const result2=profileManager.updateField("email",email)

const message=document.querySelector("#profileMessage")

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

message.textContent="Profile saved successfully!"
message.className="message success"
})


// task list
let tasks=[]
let savedJSON=""

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

document.querySelector("#addTaskBtn").addEventListener("click",addTask)

function toggleTask(id){
tasks=tasks.map(task =>
task.id===id ? {...task,completed:!task.completed} : task
)
renderTasks()
}

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

document.querySelector("#showCompleted").addEventListener("click",()=>{
renderTasks(tasks.filter(task => task.completed))
})

document.querySelector("#showAll").addEventListener("click",()=>renderTasks())

document.querySelector("#sortTasks").addEventListener("click",()=>{
const sorted=[...tasks].sort((a,b)=> new Date(b.created)-new Date(a.created))
renderTasks(sorted)
})

function updateStats(){
if(tasks.length===0){
document.querySelector("#taskStats").textContent=""
return
}
const completed=tasks.filter(t=>t.completed).length
const percent=Math.round((completed/tasks.length)*100)
document.querySelector("#taskStats").textContent=
`${completed}/${tasks.length} tasks completed (${percent}%)`
}

document.querySelector("#saveJSON").addEventListener("click",()=>{
savedJSON=JSON.stringify(tasks)
alert("Tasks saved to JSON")
})

document.querySelector("#loadJSON").addEventListener("click",()=>{
if(!savedJSON){
alert("Nothing saved yet")
return
}
tasks=JSON.parse(savedJSON)
renderTasks()
})


//backend API
async function loadItems(){
const display=document.getElementById("user-display")

try{
display.innerHTML="<p>Loading items...</p>"

const res=await fetch("/api/items")
if(!res.ok) throw new Error("Failed to fetch items")

const items=await res.json()

if(items.length===0){
display.innerHTML="<p>No items yet</p>"
return
}

display.innerHTML=items.map(item=>`
<div class="user-card">
<p><strong>${item.name}</strong></p>
</div>
`).join("")

}catch(err){
display.innerHTML="<p class='error'>Error loading items</p>"
}
}

// Add item to backend
async function addItem(){
const name=prompt("Enter item name:")
if(!name) return

try{
const res=await fetch("/api/items",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({name})
})

if(!res.ok) throw new Error("Failed to add item")

loadItems()

}catch(err){
alert("Error adding item")
}
}


// external API

async function getUser() {
const display = document.getElementById("user-display");

try {
display.innerHTML = "<p>Loading data...</p>";

const id = Math.floor(Math.random() * 10) + 1;
const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

if (!response.ok) throw new Error("Network error");

const user = await response.json();

display.innerHTML = `
<div class="user-card">
<p><strong>${user.name}</strong></p>
<p>${user.email}</p>
<p>${user.address.city}</p>
</div>
`;

} catch (error) {
display.innerHTML = "<p class='error'>Unable to load user data</p>";
}
}

async function getUsers() {
const display = document.getElementById("user-display");

try {
display.innerHTML = "<p>Loading data...</p>";

const response = await fetch("https://jsonplaceholder.typicode.com/users");
if (!response.ok) throw new Error("Network error");

const users = await response.json();

display.innerHTML = users.map(user => `
<div class="user-card">
<p><strong>${user.name}</strong></p>
<p>${user.email}</p>

<button onclick="toggleDetails(${user.id})">See Details</button>

<div id="details-${user.id}" class="hidden">
<p>City: ${user.address.city}</p>
<p>Phone: ${user.phone}</p>
<p>Company: ${user.company.name}</p>
</div>
</div>
`).join("");

} catch (error) {
display.innerHTML = "<p class='error'>Unable to load data</p>";
}
}

function toggleDetails(id){
document.getElementById(`details-${id}`).classList.toggle("hidden")
}

document.getElementById("loadUserBtn").addEventListener("click", getUser);
document.getElementById("loadUsersBtn").addEventListener("click", getUsers);


//buttons
window.loadItems = loadItems;
window.addItem = addItem;

function favoriteUser(name) {
alert(`${name} added to favorites!`);
}