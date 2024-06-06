let guestTasks = [
    {
        'category': 'in-progress',
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
    },

    {
        'category': 'in-progress',
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
    },

    {
        'category': 'await-feedback',
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
    },

    {
        'category': 'await-feedback',
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
    },

    {
        'category': 'done',
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
    },

];

/**
 * Renders the task board for guest users by iterating over guest tasks
 * and generating the HTML for each task.
 */
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



/**
 * Generates the HTML for a guest user's task card on the board page.
 * 
 * @param {Object} element - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
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

/**
 * Opens the task dialog for a guest user's task and shows the detailed view.
 * 
 * @param {number} i - The index of the task in the guest task list.
 */
function openDialogGuestTask(i) {
    document.getElementById('dialog').classList.remove('d_none');
    showGuestTaskDetails(guestTasks[i], i);
}

/**
 * Displays the detailed view of a guest user's task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the guest task list.
 */
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

/**
 * Generates the HTML for displaying the detailed view of a guest user's task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the guest task list.
 */
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
        <div class="task_dateils_date">
            <span>Due date:</span><p>${task['date']}</p>
        </div>
        <div class="task_details_priority">
            <span>Priority:</span><img src="${task['prioImg']}" alt="">
        </div>
        <div class="task_details_assigned_to">
            <span>Assigned To:</span>
            <div class="task_details_contacts" id="contacts${i}" class="openTaskContacts"></div>
        </div>
        <div class="task_details_subtasks">
            <span>Subtasks</span>
            <div class="task_details_subtask">
                <p>${task['subtasks']}</p>
            </div>        
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

/**
 * Updates the HTML content for the task board by calling functions
 * to update each section: ToDo, In Progress, Awaiting Feedback, and Done.
 */
function updateHTML() {
    updateTodo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
}

/**
 * Updates the HTML content for the "ToDo" section by filtering tasks
 * with the category 'todo' and generating their HTML.
 */
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

/**
 * Updates the HTML content for the "In Progress" section by filtering tasks
 * with the category 'in-progress' and generating their HTML.
 */
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

/**
 * Updates the HTML content for the "Await-feedback" section by filtering tasks
 * with the category 'await-feedback' and generating their HTML.
 */
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

/**
 * Updates the HTML content for the "Done" section by filtering tasks
 * with the category 'done' and generating their HTML.
 */
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

/**
 * Starts the dragging process for a task.
 * 
 * @param {number} i - The ID of the task being dragged.
 */
function startDragging(i) {
    currentDraggedTask = i;
}

/**
 * Checks if there are guest tasks stored in localStorage.
 * If they exist, parses and assigns them to the guestTasks variable.
 */
if (localStorage.getItem('guestTasks')) {
    guestTasks = JSON.parse(localStorage.getItem('guestTasks'));
}