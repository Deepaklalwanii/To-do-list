let input = document.querySelector(".input-container");
let todoList = document.querySelector(".to-do-ul");
let doingLi = document.querySelector('.doing-ul');
let doneLi = document.querySelector('.Done-ul');

// Random string generator for task IDs
function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

// Save task objects (ID and content) to localStorage
function saveToLocalStorage(key, taskObject) {
    let tasks = JSON.parse(localStorage.getItem(key)) || []; 
    tasks.push(taskObject);  
    localStorage.setItem(key, JSON.stringify(tasks)); 
}

function addTaskToList(list, taskContent, listKey) {
    if (taskContent.trim() === '') {
        alert('Please Enter a Task');
        return;
    }

    let randomId = randomString(10); 
    
    let taskObject = {
        id: randomId,
        content: taskContent
    };
    
    let newEle = document.createElement("li");
    newEle.id = randomId;
    newEle.draggable = true;
    newEle.innerHTML = `${taskContent} <i class="fa-regular fa-trash-can"></i>`;
    list.appendChild(newEle);

    // Add dragstart and dragend handlers to manage the dragging effect
    newEle.addEventListener('dragstart', (e) => {
        console.log('drag start');
        e.dataTransfer.setData("text", randomId);
        setTimeout(() => {
            e.target.classList.add('hide'); // Hide the task element during drag
        }, 0);
    });
    
    newEle.addEventListener('dragend', (e) => {
        console.log('drag end');
        e.target.classList.remove('hide');
    });

    initDragHandlers(); // Initialize the drag handlers (drop zones)

    saveToLocalStorage(listKey, taskObject);
    
    // Event listener for the trash icon
    newEle.querySelector("i").addEventListener("click", function() {
        removeItem(newEle, listKey);
    });
}

// Drag and Drop Handling
function initDragHandlers() {
    let dropZones = document.querySelectorAll('.drag');
    
    dropZones.forEach(ul => {
        ul.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        ul.addEventListener('dragenter', (e) => {
            e.preventDefault();
        });

        ul.addEventListener('dragleave', () => {
            // No action needed on dragleave
        });
        
        ul.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const taskId = e.dataTransfer.getData("text"); // Get the task ID from the dataTransfer
            const taskElement = document.getElementById(taskId); // Get the task element by ID
            
            if (taskElement) {
                // Step 1: Identify the current (old) list and new list
                const oldList = taskElement.parentElement;
                const newList = e.target.closest('ul'); // The new <ul> where task is dropped
                
                // If the task was not moved to another list, do nothing
                if (oldList === newList) return;

                // Step 2: Remove the task from the old list in both DOM and localStorage
                const oldKey = getKeyForList(oldList);  // Get the localStorage key for the old list
                removeItemFromList(taskElement, oldKey); // Remove from DOM and localStorage

                // Step 3: Add the task to the new list in the DOM
                newList.appendChild(taskElement);  // Move the task element to the new list

                // Step 4: Update localStorage after moving the task
                const newKey = getKeyForList(newList);  // Get the localStorage key for the new list
                updateLocalStorageAfterMove(taskElement, newList, oldKey, newKey);  // Update localStorage
            } else {
                console.error('Task element not found during drop event.');
            }
        });
    });
}


function displayPreviousData() {
    const keys = ['to-do-data', 'input-doing', 'input-task-done'];
    const lists = [todoList, doingLi, doneLi]; 
    
    keys.forEach((key, index) => {
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks.forEach(task => {
            // Create a list item for each task in localStorage
            let newEle = document.createElement("li");
            newEle.id = task.id; // Set the task's ID to the <li> element
            newEle.draggable = true;
            newEle.innerHTML = `${task.content} <i class="fa-regular fa-trash-can"></i>`;
            lists[index].appendChild(newEle); // Append to the correct list container

            // Add event listener for the trash icon to remove the task
            newEle.querySelector("i").addEventListener("click", function() {
                removeItem(newEle, key); 
            });

            // Add dragstart and dragend event listeners to handle the dragging effect
            newEle.addEventListener('dragstart', (e) => {
                console.log('drag start');
                e.dataTransfer.setData("text", task.id); // Use task.id, which is set above
                setTimeout(() => {
                    e.target.classList.add('hide'); // Hide the task element during drag
                }, 0);
            });

            newEle.addEventListener('dragend', (e) => {
                console.log('drag end');
                e.target.classList.remove('hide');
            });
        });
    });
}

// Function to remove a task when the trash icon is clicked
function removeItem(taskElement, listKey) {
    const taskId = taskElement.id;
    let tasks = JSON.parse(localStorage.getItem(listKey)) || []; 
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem(listKey, JSON.stringify(tasks));
    taskElement.remove();
}


// Remove item from the list and update localStorage
function removeItemFromList(taskElement, listKey) {
    const taskId = taskElement.id;
    let tasks = JSON.parse(localStorage.getItem(listKey)) || [];
    tasks = tasks.filter(task => task.id !== taskId);  // Remove task by ID
    localStorage.setItem(listKey, JSON.stringify(tasks));  // Update localStorage
    taskElement.remove();  // Remove the task element from the DOM
}

// Update localStorage after moving the task to another list

function updateLocalStorageAfterMove(taskElement, newList, oldKey, newKey) {
    const taskId = taskElement.id;
    const taskContent = taskElement.textContent.trim();  // Get task content

    // Create task object for localStorage update
    const task = {
        id: taskId,
        content: taskContent
    };

    // Step 1: Remove the task from the old list
    let oldTasks = JSON.parse(localStorage.getItem(oldKey)) || [];
    oldTasks = oldTasks.filter(task => task.id !== taskId);  // Remove task by ID
    localStorage.setItem(oldKey, JSON.stringify(oldTasks));  // Update localStorage for the old list

    // Step 2: Add the task to the new list
    let newTasks = JSON.parse(localStorage.getItem(newKey)) || [];
    newTasks.push(task);  // Add task to the new list
    localStorage.setItem(newKey, JSON.stringify(newTasks));  // Update localStorage for the new list
}

function getKeyForList(list) {
    if (list === todoList) return 'to-do-data';  
    if (list === doingLi) return 'input-doing'; 
    if (list === doneLi) return 'input-task-done';
}

// Add task to To-Do list on click on Enter key
input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {  // If 'Enter' key is pressed
        let taskContent = input.value.trim();
        if (taskContent !== '') {
            addTaskToList(todoList, taskContent, 'to-do-data');
            input.value = '';  // Clear the input field
        }
    }
});

// Click event handlers to add tasks to each list
document.querySelector('#to-do').addEventListener('click', function() {
    let taskContent = input.value.trim();
    if (taskContent !== '') {
        addTaskToList(todoList, taskContent, 'input-doing');
        input.value = '';
    }
});

document.querySelector('#doing').addEventListener('click', function() {
    let taskContent = input.value.trim();
    if (taskContent !== '') {
        addTaskToList(doingLi, taskContent, 'input-doing');
        input.value = '';
    }
});

document.querySelector('#done').addEventListener('click', function() {
    let taskContent = input.value.trim();
    if (taskContent !== '') {
        addTaskToList(doneLi, taskContent, 'input-task-done');
        input.value = '';
    }
});




window.onload = function() {
    displayPreviousData(); 
    initDragHandlers(); 
};
