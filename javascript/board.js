let currentDraggedTask = null;

function openAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.remove('slide-out');
    container.classList.remove('d-none');
    container.innerHTML = `
    <div class="padding-top">
    <div class="popup-headline">
        <h1>Add Task</h1>
        <div class="close-popup">
            <img onclick="closeAddTask()" src="assets/img/add_task/close.svg">
        </div>
    </div>
    <div class="add-task-section">

        <div class="add-task-titel-container">
            <form action="">
            <p>Titel<span class="color-red">*</span></p>
            <input required class="margin-buttom" type="text" placeholder="Enter a title">
            <p>Description</p>
            <textarea class="margin-buttom" name="" id="" placeholder="Enter a Description"></textarea>
            <p>Assigned to</p>
            <div class="custom-select" style="width:100%;">
                <select>
                  <option value="0">Select car:</option>
                  <option class="assigned-conainer" value="1">
                <div class="assigned-circle-name">SM</div>
                 <p>Sofia Müller</p>
                 
                  </option>
                </select>
              </div>
        </div>

        <div class="add-task-between-line"></div>

        <div class="add-task-date-container">
            <p>Due date<span class="color-red">*</span></p>
            <input required class="margin-buttom" type="date">
            <p>Prio</p>
            <div class="margin-buttom add-task-prio prio-gap">
                <div class="prio-selection-urgent">
                    <span>Urgent</span> 
                    <img class="prio-icons" src="./assets/img/add_task/arrowsTop.svg">
                </div>
                <div class="prio-selection-medium">
                    <span>Medium</span> 
                    <img class="prio-icons" src="./assets/img/add_task/result.svg">
                </div>
                <div class="prio-selection-low">
                    <span>Low</span> 
                    <img class="prio-icons" src="./assets/img/add_task/arrowsButtom.svg">
                </div>
            </div>
            <p>Category<span class="color-red">*</span></p>
            <div class="custom-select" style="width:100%;">
                <select>
                  <option value="0">Select car:</option>
                  <option value="1">Audi</option>
                  <option value="2">BMW</option>
                </select>
              </div>
            <p>Subtasks</p>
            <input type="text" name="" id="">
        </div>

    </div>

    <div class="add-task-buttons">
        <p class="required-text"><span class="color-red">*</span>This field is required</p>
        <div class="popup-buttons">
            <button onclick="cancelAddTask()" class="clear-button">Cancel <img src="assets/img/add_task/close.svg"></button>
            <button class="btn" onsubmit="">Create Task <img src="assets/img/add_task/check.svg"></button>
        </div>
    </div>
</form>
`;
}

function closeAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.add('d-none');
}

function cancelAddTask() {
    let popup = document.getElementById('add-task-popup');
    popup.classList.add('slide-out');
    popup.addEventListener('transitionend', function () { // sobald die animation fertig ist, wird der task geschlossen
        closeAddTask();
    }, { once: true });
}

/**
 * This function generates the HTML for a task card on the board page.
 * 
 * @param {Object} element - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateTodoHTML(element, i) {
    return /*html*/`
    <div id="task${i}" draggable="true" ondragstart="startDragging(${i})" class="todo">
        <div class="task-card" onclick="openDialogTask(${i})">
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
 * This function opens the task window with a detailed view.
 * 
 * @param {number} i - The index of the task in the task list.
 */
async function openDialogTask(i) {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();

    let user = localStorage.getItem('userKey');
    let path = responseToJson['registered'][user];
    let tasks = path['tasks'];


    document.getElementById('dialog').classList.remove('d_none');
    showTaskDetails(tasks[i], i)
}

/**
 * Displays the detailed view of a task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.

 */
function showTaskDetails(task, i) {
    let taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML = '';
    taskDetails.innerHTML = generateTaskDetails(task, i);

    let content = document.getElementById(`contacts${i}`);

    for (let j = 0; j < task['taskContacts'].length; j++) {
        let contact = task['taskContacts'][j];
        content.innerHTML += `
        <div class="arrange_assigned_to_contacts">
            <span class="user-icon" style="background-color: ${contact['color']};">${contact['initials']}</span>
            <p> ${contact['name']}</p>
        </div>
        `;
    }
    
    let subtasks = document.getElementById(`task_subtasks`);
    subtasks.innerHTML='';

    for (let k = 0; k < task['subtasks'].length; k++) {
        let subtask = task['subtasks'][k];
        console.log(subtask);
        subtasks.innerHTML += `
        <div id="single_subtask">
            <input type="checkbox">
            <p>${subtask}</p>
        </div>
        `;
    }
}

/**
 * Generates the HTML for displaying the detailed view of a task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateTaskDetails(task, i) {
    return /*html*/`
    <div class="task-card-type">
         <div class="type-bg">${task['taskCategory']}</div>
    </div>
    <div class="header_task_details">
        <h1>${task['title']}</h1>
        <h2 class="task-description">${task['description']}</h2>
    </div>
    <div class="task_details_information">
        <div class="task_details_date">
            <span>Due date:</span><p>${task['date']}</p>
        </div>
        <div class="task_details_priority">
            <span>Priority:</span> <p>${task['prio']}</p> <img src="${task['prioImg']}" alt="">
        </div>
        <div class="task_details_assigned_to">
            <span>Assigned To:</span>
            <div class="task_details_contacts" id="contacts${i}" class="openTaskContacts"></div>
        </div>
        <div class="task_details_subtasks">
            <span>Subtasks</span>
            <div class="task_details_subtask" id="task_subtasks">
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
    let todo = test.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let i = 0; i < todo.length; i++) {
        const todoElement = todo[i];
        document.getElementById('todo').innerHTML += generateTodoHTML(todoElement);
    }

}

/**
 * Updates the HTML content for the "In Progress" section by filtering tasks
 * with the category 'in-progress' and generating their HTML.
 */
function updateInProgress() {
    let inProgress = test.filter(t => t['category'] == 'in-progress');

    document.getElementById('in-progress').innerHTML = '';

    for (let i = 0; i < inProgress.length; i++) {
        const inProgressElement = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTodoHTML(inProgressElement);
    }
}

/**
 * Updates the HTML content for the "Await-feedback" section by filtering tasks
 * with the category 'await-feedback' and generating their HTML.
 */
function updateAwaitFeedback() {
    let awaitFeedback = test.filter(t => t['category'] == 'await-feedback');

    document.getElementById('await-feedback').innerHTML = '';

    for (let i = 0; i < awaitFeedback.length; i++) {
        const awaitFeedbackElement = awaitFeedback[i];
        document.getElementById('await-feedback').innerHTML += generateTodoHTML(awaitFeedbackElement);
    }
}

/**
 * Updates the HTML content for the "Done" section by filtering tasks
 * with the category 'done' and generating their HTML.
 */
function updateDone() {
    let done = test.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let i = 0; i < done.length; i++) {
        const doneElement = done[i];
        document.getElementById('done').innerHTML += generateTodoHTML(doneElement);
    }
}

/**
 * Starts the dragging process for a task.
 * 
 * @param {number} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedTask = id;
}

/**
 * Allows a drop event by preventing the default handling of the event.
 * 
 * @param {Event} ev - The event object representing the dragover event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves the currently dragged task to a new category and updates the data.
 * 
 * @param {string} category - The new category to move the task to.
 */
async function moveTo(category) {
    if (localStorage.getItem('username') !== 'Guest') {
        test[currentDraggedTask]['category'] = category;
        await putData(category);
        updateHTML();
        currentDraggedTask = null;
    } else {
        guestTasks[currentDraggedTask]['category'] = category;
        localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
        currentDraggedTask = null;
        updateHTML();
        window.location.reload();
    }
}

/**
 * Highlights a specified element by adding a CSS class.
 * 
 * @param {string} id - The ID of the element to be highlighted.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag_area_hightlight');
}

/**
 * Removes the highlight from a specified element by removing a CSS class.
 * 
 * @param {string} id - The ID of the element from which the highlight should be removed.

 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag_area_hightlight');
}


/**
 * Closes the task dialog by adding a CSS class to hide it.
 */
function closeDialogTask() {
    document.getElementById('dialog').classList.add('d_none');
}

/**
 * Updates the category of the currently dragged task in the database and reloads the page.
 * 
 * @param {string} category - The new category to update the task to.
 */
async function putData(category) {
    try {
        let response = await fetch(`${firebaseUrl}.json`);
        let responseToJson = await response.json();

        let user = localStorage.getItem('userKey');
        let pathUser = responseToJson['registered'][user];
        let tasks = pathUser['tasks'];

        tasks[currentDraggedTask]['category'] = category;
        await dataUser(`/registered/${user}/tasks/${currentDraggedTask}`, { category: category });

        console.log(tasks[currentDraggedTask]['category']);
        window.location.reload()

    } catch (error) {
        console.error('Fehler beim Aktualisieren der Daten:', error);
    }

}

/**
 * Sends a PATCH request to update user data at the specified path in the Firebase database.
 * 
 * @param {string} path - The path to append to the Firebase URL for updating data.
 * @param {Object} data - The data to be sent in the PATCH request.
 */
async function dataUser(path = "", data = {}) {
    let response = await fetch(firebaseUrl + path + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}