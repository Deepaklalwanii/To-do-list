let input = document.querySelector(".input-container");
let todoList = document.querySelector(".to-do-ul");
let doingLi = document.querySelector('.doing-ul');
let doneLi = document.querySelector('.Done-ul');

// Function to generate a random string (for task IDs)
function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}


function saveToLocalStorage(key, taskContent) {
    let tasks = JSON.parse(localStorage.getItem(key)) || [];
    tasks.push(taskContent);
    localStorage.setItem(key, JSON.stringify(tasks));
}


function addTaskToList(list, taskContent, listKey) {
    if (taskContent.trim() === '') {
        alert('Please Enter a Task');
        return;
    }

    let randomId = randomString(10);
    let newEle = document.createElement("li");
    newEle.id = randomId;
    newEle.innerHTML = `${taskContent} <i class="fa-regular fa-trash-can"></i>`;
    list.appendChild(newEle);

    
    saveToLocalStorage(listKey, taskContent);

    
    newEle.querySelector("i").addEventListener("click", function() {
        removeItem(newEle, listKey);
    });
}

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

// Function to display previous data from localStorage
function displayPreviousData() {
    
    ['to-do-data', 'input-doing', 'input-task-done'].forEach((key, index) => {
        const list = [todoList, doingLi, doneLi][index];
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks.forEach(task => {
            let newEle = document.createElement("li");
            newEle.innerHTML = `${task} <i class="fa-regular fa-trash-can"></i>`;
            list.appendChild(newEle);

            // Add event listener for trash icon
            newEle.querySelector("i").addEventListener("click", function() {
                removeItem(newEle, key);
            });
        });
    });
}


function removeItem(liElement, key) {
    const taskText = liElement.textContent.trim();
    let tasks = JSON.parse(localStorage.getItem(key)) || [];
    const index = tasks.indexOf(taskText);
    if (index > -1) {
        tasks.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(tasks));
    }
    liElement.remove();
}


input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let taskContent = input.value.trim();
        if (taskContent !== '') {
            addTaskToList(todoList, taskContent, 'to-do-data');
            input.value = '';  // Clear the input field
        }
    }
});


window.onload = displayPreviousData;



