let guestTasks = [
{
    'category': 'todo',
    'taskCategory': 'User Story',
    'title': 'Header',
    'description': 'Header Template erstellen',
    'date': '16.08.2024',
    'taskContacts': [
        {
            'color': '#8128EE',
            'initials': 'AM',
            'name': 'Anton Mayer'
        },
        {
            'color': '#8128EE',
            'initials': 'AM',
            'name': 'Anton Mayer'
        },
        {
            'color': '#8128EE',
            'initials': 'AM',
            'name': 'Anton Mayer'
        }
    ],
    'prioImg': './assets/img/add_task/result.svg',
    'subtasks': 'Erstellen, Stylen'
}

];

async function renderGuestTaskBoard() {
            for (let i = 0; i < guestTasks.length; i++) {
                let task = guestTasks[i];
                let id = task['category'];
                
                document.getElementById(id).innerHTML += generateGuestTodoHTML(task, i);

                let contactsContent = document.getElementById(`taskContacts${i}`);
                for (let j = 0; j < task['taskContacts'].length; j++) {
                    let contacts = task['taskContacts'][j];

                    contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
                }
            }
        }
    
function generateGuestTodoHTML(element, i) {
    return /*html*/`
    <div id="task${i}" draggable="true" ondragstart="startDragging(${i})" class="todo">
        <div class="task-card" onclick="openDialogGuestTask(${i})">
            <div class="task-card-type">
                <div class="type-bg" style="background-color: blue;">${element['taskCategory']}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description">${element['description']}</p>
            <div class="progress">
                <div class="progress-bar"></div>
                    ${element['subtasks']} Subtasks
            </div>
            <div class="task-card-bottom">
                <div class="taskContacts" id="taskContacts${i}">
                </div>
                <img src="assets/img/Vector.svg">
            </div>
        </div>
    </div>
    `;
}


function openDialogGuestTask(i) {
    document.getElementById('dialog').classList.remove('d_none');
    showGuestTaskDetails(guestTasks[i], i);
}

function showGuestTaskDetails(task, i) {
    let taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML = '';
    taskDetails.innerHTML = generateGuestTaskDetails(task, i);

    let content = document.getElementById(`contacts${i}`);
    
    
        for (let j = 0; j < task['taskContacts'].length; j++) {
            let contact = task['taskContacts'][j];
            content.innerHTML += `<p class="user-icon" style="background-color: ${contact['color']};">${contact['initials']}</p>`;
        }
    }


function generateGuestTaskDetails(task, i) {
    return /*html*/`
    <div class="task-card-type">
         <div class="type-bg">${task['taskCategory']}</div>
    </div>
    <div class="header_task_details">
        <h1>${task['title']}</h1>
        <p class="task-description">${task['description']}</p>
    </div>
    <div class="task_details_information">
        <div>
            <p>Due date:</p><p>${task['date']}</p>
        </div>
        <div>
            <p>Priority</p><img src="${task['prioImg']}" alt="">
        </div>
        <div>
            <p>Assigned To:</p>
            <div id="contacts${i}" class="openTaskContacts"></div>
        </div>
        <div>
            <p>Subtasks</p>
            <p>${task['subtasks']}</p>
        </div>
        <footer class="details_delete_edit">
            <img src="../assets/img/delete.svg" alt="">
            <p>Delete</p>|
            <img src="../assets/img/edit.svg" alt="">
            <p>Edit</p>
        </footer>
    </div>
    `;
}


function updateHTML() {
    updateTodo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
}


function updateTodo() {
    let todo = guestTasks.filter(t => t['category'] == 'todo');
    document.getElementById('todo').innerHTML = '';
    for (let i = 0; i < todo.length; i++) {
        const todoElement = todo[i];
        document.getElementById('todo').innerHTML += generateGuestTodoHTML(todoElement, i);

        let contactsContent = document.getElementById(`taskContacts${i}`);
        for (let j = 0; j < todoElement['taskContacts'].length; j++) {
            let contacts = todoElement['taskContacts'][j];
            contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
        }
    }
}

function updateInProgress() {
    let inProgress = guestTasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const inProgressElement = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateGuestTodoHTML(inProgressElement, i);

        let contactsContent = document.getElementById(`taskContacts${i}`);
        for (let j = 0; j < inProgressElement['taskContacts'].length; j++) {
            let contacts = inProgressElement['taskContacts'][j];
            contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
        }
    }
}

function updateAwaitFeedback() {
    let awaitFeedback = guestTasks.filter(t => t['category'] == 'await-feedback');
    document.getElementById('await-feedback').innerHTML = '';
    for (let i = 0; i < awaitFeedback.length; i++) {
        const awaitFeedbackElement = awaitFeedback[i];
        document.getElementById('await-feedback').innerHTML += generateGuestTodoHTML(awaitFeedbackElement, i);

        let contactsContent = document.getElementById(`taskContacts${i}`);
        for (let j = 0; j < awaitFeedbackElement['taskContacts'].length; j++) {
            let contacts = awaitFeedbackElement['taskContacts'][j];
            contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
        }
    }
}

function updateDone() {
    let done = guestTasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const doneElement = done[i];
        document.getElementById('done').innerHTML += generateGuestTodoHTML(doneElement, i);

        let contactsContent = document.getElementById(`taskContacts${i}`);
        for (let j = 0; j < doneElement['taskContacts'].length; j++) {
            let contacts = doneElement['taskContacts'][j];
            contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
        }
    }
}

function startDragging(i) {
    currentDraggedTask = i;
}

if (localStorage.getItem('guestTasks')) {
    guestTasks = JSON.parse(localStorage.getItem('guestTasks'));
}