
// Function to add Task 

function addTask() {
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').value;
    const priority = document.querySelector('input[name="priority"]:checked');
    if (!taskTitle || !taskDescription || !priority) {
        alert('Please fill the all fields!');
    }
    
    
    const taskDetails = {
        id: Date.now(),
        taskTitle,
        taskDescription,
        priority: priority.value,
        dateTime: new Date().toLocaleString(),
        status: false,
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskDetails);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    priority.checked = false;
}








let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
console.log("completed Task array",completedTasks);

function updateStatus(id) {
    // Find the task with the given id
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex > -1) {
        // Create a copy of the task
        const completedTask = { ...tasks[taskIndex] };

        // Add the task to completedTasks array
        let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        completedTasks.push(completedTask);

        // Save completedTasks array to localStorage
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

        // Remove the task from tasks array
        tasks.splice(taskIndex, 1);

        // Save updated tasks array to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Refresh the displayed tasks
        displayTasks(tasks);
        displayCompletedTasks(completedTasks);
    }
}


// localStorage.removeItem('tasks');  to delet all items
// To display task 

let currentPage = 1;
const tasksPerPage = 3;
function displayTasks(tasksToDisplay) {
    const taskDetailsDiv = document.getElementById('taskDetails');
    taskDetailsDiv.innerHTML = '';

    // Check if tasksToDisplay is empty
    if (tasksToDisplay.length === 0) {
        const noTaskMessage = document.createElement('p');
        noTaskMessage.classList.add('no-task')
        noTaskMessage.innerText = 'No pending tasks';
        taskDetailsDiv.appendChild(noTaskMessage);
        return; // Stop further execution
    }


    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;

    const currentTasks = tasksToDisplay.slice(startIndex, endIndex);
    currentTasks.forEach((task, index) => {
        const taskBox = document.createElement('div');
        taskBox.classList.add('task-box');


        let priorityClass = ''; // Initialize priorityClass variable
    
        switch (task.priority) {
            case 'High':
                priorityClass = 'high1';
                break;
            case 'Medium':
                priorityClass = 'medium1';
                break;
            case 'Low':
                priorityClass = 'low1';
                break;
            default:
                break;
        }

        taskBox.innerHTML = `
        <div class="upper">
           <div class="title-part">
            <p class="title-text"><b>Title :</b> ${task.taskTitle}</p>
           </div>

          <div class="task-icons">
           <i class="fa-solid fa-pen-to-square edit-task" onclick="editTask()"></i>
           <div class="p-task">
            <p class="p-text " >${task.priority}</p>
            <i class="fa-solid fa-circle priority-icon ${priorityClass}"></i>
           </div>
           <i class="fa-solid fa-trash d-icon" onclick="deleteTask(${task.id})"></i>
          </div>
        </div>  

        <div>
        <p class="desc-text">${task.taskDescription}</p>
        </div> 

        <div class="lower">
          <div class="d-section">
            <i class="fa-solid fa-calendar-days c-icon"></i>
            <p class="date">${task.dateTime}</p>
          </div>

          <div class="u-class"  onclick="updateStatus(${task.id})">
            <p class="u-btn">Mark as a Completed </p>
            <i class="fa-solid fa-square-check u-icon"></i>
          </div>
        
        </div>


            
          
        `;
       
        taskDetailsDiv.appendChild(taskBox);
        
    });
    if(tasksToDisplay.length!==0){
    addPagination(tasksToDisplay.length);
    }
}

function addPagination(totalTasks) {
    const totalPages = Math.ceil(totalTasks / tasksPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    // Add previous button
    const prevButton = document.createElement('div');
    prevButton.innerText = '<';
    prevButton.classList.add('pagination-button');
    prevButton.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            displayTasks(tasks);
        }
    };
    paginationDiv.appendChild(prevButton);

    // Add page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('div');
        pageButton.innerText = i;
        pageButton.classList.add('pagination-button');

        if (i === currentPage) {
            pageButton.classList.add('current-page'); // Highlight current page
        }
        pageButton.onclick = function() {
            currentPage = i;
            displayTasks(tasks);
        };
        paginationDiv.appendChild(pageButton);
    }

    // Add next button
    const nextButton = document.createElement('div');
    nextButton.innerText = '>';
    nextButton.classList.add('pagination-button');
    nextButton.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayTasks(tasks);
        }
    };
    paginationDiv.appendChild(nextButton);
}


function sortTasks(type) {
    let filteredTasks = [];

    switch (type) {
        case 'latest':
            filteredTasks = tasks.sort((a, b) => b.id - a.id);
            break;

        case 'high':
            filteredTasks = tasks.filter(task => task.priority === 'High');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;
            
        case 'medium':
            filteredTasks = tasks.filter(task => task.priority === 'Medium');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;
            
        case 'low':
            filteredTasks = tasks.filter(task => task.priority === 'Low');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;

        default:
            break;
    }

    displayTasks(filteredTasks);
}




function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks(tasks);
   
}

// To delete the completedTask List 
function deleteC(id) {
    
    
    // Filter out the task with the given id
    completedTasks = completedTasks.filter(task => task.id !== id);
    
    // Update the localStorage and display
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    displayCompletedTasks(completedTasks);
}
console.log(tasks);
// Display tasks when page loads
displayTasks(tasks);


// Pagination for completedTasks
let currentPage1 = 1;
const tasksPerPage1 = 5;

function addPagination2(totalTasks) {
    const totalPages = Math.ceil(totalTasks / tasksPerPage1);
    const paginationDiv = document.getElementById('pagination1');
    paginationDiv.innerHTML = '';

    // Add previous button
    const prevButton = document.createElement('div');
    prevButton.innerText = '<';
    prevButton.classList.add('pagination-button');
    prevButton.onclick = function() {
        if (currentPage1 > 1) {
            currentPage1--;
            displayCompletedTasks(completedTasks);
        }
    };
    paginationDiv.appendChild(prevButton);

    // Add page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('div');
        pageButton.innerText = i;
        pageButton.classList.add('pagination-button');

        if (i === currentPage1) {
            pageButton.classList.add('current-page'); // Highlight current page
        }
        pageButton.onclick = function() {
            currentPage1 = i;
            displayCompletedTasks(completedTasks);
        };
        paginationDiv.appendChild(pageButton);
    }

    // Add next button
    const nextButton = document.createElement('div');
    nextButton.innerText = '>';
    nextButton.classList.add('pagination-button');
    nextButton.onclick = function() {
        if (currentPage1 < totalPages) {
            currentPage1++;
            displayCompletedTasks(completedTasks);
        }
    };
    paginationDiv.appendChild(nextButton);
}


function displayCompletedTasks(completedTasks) {
    const completedTaskSection = document.getElementById('completedTaskSection');
    completedTaskSection.innerHTML = ''; // Clear previous tasks

    if (completedTasks.length === 0) {
        const noTaskMessage = document.createElement('p');
        noTaskMessage.classList.add('no-task')
        noTaskMessage.innerText = 'There is No Completed Tasks Exist!';
        completedTaskSection.appendChild(noTaskMessage);
        return; // Stop further execution
    }

    const startIndex = (currentPage1 - 1) * tasksPerPage1;
    const endIndex = startIndex + tasksPerPage1;

    const currentTasks = completedTasks.slice(startIndex, endIndex);




    currentTasks.forEach((task, index) => {
        const taskBox2 = document.createElement('div');
        taskBox2.classList.add('task-box2');
        switch (task.priority) {
            case 'High':
                priorityClass = 'high1';
                break;
            case 'Medium':
                priorityClass = 'medium1';
                break;
            case 'Low':
                priorityClass = 'low1';
                break;
            default:
                break;
        }
        taskBox2.innerHTML = `
        <div>
        <p class="titleC"><b>TITLE :</b> <span>${task.taskTitle}</span></p>
    </div>

    <div class="icon-set">
      <div class="cp-section">
        <p>${task.priority}</p>
        <i class="fa-solid fa-circle cp-icon ${priorityClass}"></i>
      </div>
      <i class="fa-solid fa-trash dC-icon" onclick="deleteC(${task.id})"></i>
    </div>
        `;
        completedTaskSection.appendChild(taskBox2);
    });
    if(completedTasks.length!==0){
        addPagination2(completedTasks.length);
        }
    
}

// sorting of completed Tasks 
function sortTasks2(type) {
    let filteredTasks = [];

    switch (type) {
        case 'high':
            filteredTasks = completedTasks.filter(task => task.priority === 'High');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;
            
        case 'medium':
            filteredTasks = completedTasks.filter(task => task.priority === 'Medium');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;
            
        case 'low':
            filteredTasks = completedTasks.filter(task => task.priority === 'Low');
            filteredTasks.sort((a, b) => b.id - a.id);
            break;

        default:
            break;
    }

    displayCompletedTasks(filteredTasks);
}







displayCompletedTasks(completedTasks);