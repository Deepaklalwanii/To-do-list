let input = document.querySelector(".input-container");
let drags = document.getElementsByClassName('drag');
let todoList = document.querySelector(".to-do-ul");
let doingLi = document.querySelector('.doing-ul');
let doneLi = document.querySelector('.Done-ul');


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


// General function to add a task to any list (to-do, doing, done)
function addTaskToList(list, taskContent, listKey) {
    if (taskContent.trim() === '') {
        alert('Please Enter a Task');
        return;
    }

    let randomId = randomString(10);  // Generate random ID
    
    let taskObject = {
        id: randomId,
        content: taskContent
    };
    
    let newEle = document.createElement("li");
    newEle.id = randomId;
    newEle.draggable = true;
    newEle.innerHTML = `${taskContent} <i class="fa-regular fa-trash-can"></i>`;
    newEle.setAttribute("ondragstart", "drag(event)");
    list.appendChild(newEle);
    
    newEle.addEventListener('dragstart' , (e)=>{
        console.log('drag start')
        setTimeout(()=>{
            e.target.classList.add('hide');
        },0)
        
    });
    newEle.addEventListener('dragend' , (e)=>{
        console.log('drag end')
        e.target.classname = 'newEle';
        e.target.classList.remove('hide');
    });

    initDragHanders();

    
    // Save task object (ID and content) to localStorage
    saveToLocalStorage(listKey, taskObject);
    
    // Event listener for the trash icon
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

function initDragHanders() {
    let drags = document.querySelectorAll('.drag'); 
    for(ul of drags){
        // console.log('ul',ul);
        ul.addEventListener('dragover' , (e)=>{
            e.preventDefault();
            console.log('drag over has been triggered')
        })

        ul.addEventListener('dragenter' , (e)=>{
            e.preventDefault();
            console.log('drag enter has been triggered')
        })

        ul.addEventListener('dragleave' , ()=>{
            console.log('drag leave has been triggered')
        })

        ul.addEventListener('drop' , (e)=>{
            console.log('drop has been triggered')
            e.target.append(newEle);
        })

    }
}

function displayPreviousData() {

    ['to-do-data', 'input-doing', 'input-task-done'].forEach((key, index) => {
        const list = [todoList, doingLi, doneLi][index];
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        tasks.forEach(task => {
            
            let newEle = document.createElement("li");
            newEle.id = task.id; 
            newEle.draggable = true;
            newEle.innerHTML = `${task.content} <i class="fa-regular fa-trash-can"></i>`;
            newEle.setAttribute("ondragstart", "drag(event)");
            list.appendChild(newEle);


            newEle.addEventListener('dragstart' , (e)=>{
                console.log('drag start')
                setTimeout(()=>{
                    e.target.classname = 'hide'
                },0)
                
            });
            newEle.addEventListener('dragend' , (e)=>{
                console.log('drag end')
                e.target.classname = 'newEle';
            });
        

            // Add event listener for the trash icon to remove the task
            newEle.querySelector("i").addEventListener("click", function() {
                removeItem(newEle, key);
            });
        });
    });
}



function removeItem(liElement, key) {
    const taskId = liElement.id;  // Get the ID of the task element
    let tasks = JSON.parse(localStorage.getItem(key)) || [];  // Get tasks from localStorage

    // Filter out the task with the matching ID
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem(key, JSON.stringify(tasks));

    liElement.remove();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
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


window.onload = function() {
    displayPreviousData();
    initDragHanders();
}



