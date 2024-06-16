let currentDraggedTask = null;
let checkboxStates = {};

function openAddTask() {
    if (window.matchMedia("(max-width: 1100px)").matches) {
        window.location.href = 'add_task.html';
    } else {
        let container = document.getElementById('add-task-popup');
        container.classList.remove('slide-out');
        container.classList.remove('d-none');
        container.innerHTML = generateAddTaskHtml();
    }
}

function generateAddTaskHtml() {
    return `
    <div>
    <h1>Add Task</h1>
    <!-- anfang -->
    <div class="add-task-section">

        <div class="add-task-titel-container">
            <form onsubmit="addNewTask(event)" action="">
                <p>Titel<span class="color-red">*</span></p>
                <input id="title" required class="margin-buttom" type="text" placeholder="Enter a title">
                <p>Description</p>
                <textarea id="description" class="margin-buttom" name="" id=""
                    placeholder="Enter a Description"></textarea>

                <p>Assigned to</p>
                <input onclick="openAssigned(event)" id="assignedSearch" type="search" onkeydown="filterContacts()" class="assigned-search"
                    placeholder="Select contacts to assign">
                <div onclick="event.stopPropagation()" class="assigned-contacts-container d-none" id="assignedContainer">

                </div>
                <div class="selected-contact d-none" id="selectedContact"></div>
        </div>

        <div class="add-task-between-line"></div>

        <div class="add-task-date-container">
            <p>Due date<span class="color-red">*</span></p>
            <input id="date" required class="margin-buttom" type="date">
            <p>Prio</p>
            <div class="margin-buttom add-task-prio">
                <div class="prio-selection-urgent" onclick="taskUrgent()" id="urgent">
                    <span>Urgent</span>
                    <img id="imgUrgent" class="prio-icons" src="./assets/img/add_task/arrowsTop.svg">
                </div>
                <div class="prio-selection-medium medium" onclick="taskMedium()" id="medium">
                    <span>Medium </span>
                    <img id="imgMedium" class="prio-icons" src="./assets/img/add_task/result_white.svg">
                </div>
                <div class="prio-selection-low" onclick="taskLow()" id="low">
                    <span>Low</span>
                    <img id="imgLow" class="prio-icons" src="./assets/img/add_task/arrowsButtom.svg">
                </div>
            </div>
            <p>Category<span class="color-red">*</span></p>
            <div class="custom-select" style="width:100%;">
                <select id="select">
                    <option value="0">Select task category</option>
                    <option value="1">Technical Task</option>
                    <option value="2">User Story</option>
                </select>
            </div>
            <p>Subtasks</p>
            <div class="subtasks-container">
                <input id="subtask" placeholder="Add new subtask" onkeypress="return event.keyCode!=13">
                <div class="subtasks-button">
                    <button onclick="addNewSubtasks()" type="button">+</button>
                </div>
            </div>
            <div class="subtasks-list">
                <ul id="subtasksList"></ul>
            </div>
        </div>

    </div>

    <div class="send-add-task-buttons">
        <p class="required-text"><span class="color-red">*</span>This field is required</p>
        <div class="buttons">
            <button onclick="clearTask()" type="button" class="clear-button">Clear <img
                    src="assets/img/add_task/close.svg"></button>
            <button class="btn">Create Task <img src="assets/img/add_task/check.svg"></button>
        </div>
    </div>
    </form>
    </div>
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
    <div id="task${i}" draggable="true" ondragstart="startDragging(${i})" class="todo task-item" data-index="${i}">
        <div class="task-card" onclick="openDialogTask(${i})">
            <div class="task-card-type">
                <div class="type-bg" style="background-color: blue;">${element['taskCategory']}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description shorter_description">${element['description']}</p>
            <div class="progress" id="progress">
                <div class="progress-bar" id="progress-bar">
                    <div class="progress-bar-content" id="progress-bar-content-${i}"></div>
                </div>
                <span onload="updateProgressBar(i)" id="completed-subtasks-${i}">Subtasks</span>
            </div>
            <div class="task-card-bottom">
                <div class="taskContacts" id="taskContacts${i}">
                </div>
                <img src="${element['prioImg']}">
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

    updateProgressBar(i);
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

    renderCheckbox(i);

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
    subtasks.innerHTML = '';

    for (let k = 0; k < task['subtasks'].length; k++) {
        let subtask = task['subtasks'][k];
        let isChecked = isSubtaskChecked(i, k) ? 'checked' : '';

        if (subtask['title'] === 0) {
            document.getElementById('progress').innerHTML = '';
        } else {
            subtasks.innerHTML += `
        <div id="single_subtask_${i}_${k}" class="single_subtask">
            <input onclick="updateProgressBar(${i}); saveCheckboxState(${i}, ${k})" class="subtask-checkbox" type="checkbox" ${isChecked}>
            <p>${subtask['title']}</p>
        </div>
        `;
        }
    }


updateAllProgressBars();
updateProgressBar(i);
}


function updateProgressBar(i) {
    let allSubtasks = document.querySelectorAll(`#task_subtasks .single_subtask input[type="checkbox"]`).length;
    let completedSubtasks = document.querySelectorAll(`#task_subtasks .single_subtask input[type="checkbox"]:checked`).length;

    let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
    subtasksAmount.innerHTML = `${completedSubtasks}/${allSubtasks} Subtasks`;

    let progress = (completedSubtasks / allSubtasks) * 100;
    let progressBarContent = document.getElementById(`progress-bar-content-${i}`);

    if (progressBarContent) {
        progressBarContent.style.width = progress + '%';
    }
}


async function saveCheckboxState(taskIndex, subtaskIndex) {
    let checkbox = document.querySelector(`#single_subtask_${taskIndex}_${subtaskIndex} .subtask-checkbox`);
    if (!checkboxStates[taskIndex]) {
        checkboxStates[taskIndex] = {};
    }

    let isChecked = checkbox.checked;
    checkboxStates[taskIndex][subtaskIndex] = isChecked;

    let userKey = localStorage.getItem('userKey');
    let path = `registered/${userKey}/tasks/${taskIndex}/subtasks/${subtaskIndex}`;
    let data = { state: isChecked };
    await dataUser(path, data);
}


function saveCheckboxStateGuest(i) {

}


async function updateAllProgressBars() {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let userKey = localStorage.getItem('userKey');

    let tasks = responseToJson['registered'][userKey]['tasks'];

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let subtasks = task['subtasks'];

        if (subtasks.length === 0) {
            document.getElementById('').innerHTML = 
        }

        let allSubtasks = subtasks.length;
        let completedSubtasks = subtasks.filter(subtask => subtask['state']).length;

        let progress = (completedSubtasks / allSubtasks) * 100;

        let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
        subtasksAmount.innerHTML = `${completedSubtasks}/${allSubtasks} Subtasks`;

        let progressBarContent = document.getElementById(`progress-bar-content-${i}`);

        if (progressBarContent) {
            progressBarContent.style.width = progress + '%';
        }

    }
}


function isSubtaskChecked(taskIndex, subtaskIndex) {
    return checkboxStates[taskIndex] && checkboxStates[taskIndex][subtaskIndex];
}

async function renderCheckbox(taskIndex) {
    let subtasksContainer = document.getElementById('task_subtasks');
    if (!subtasksContainer) {
        console.error('task_subtasks element not found');
        return;
    }

    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let userKey = localStorage.getItem('userKey');

    let tasks = responseToJson['registered'][userKey]['tasks'];
    subtasksContainer.innerHTML = '';

    if (tasks[taskIndex]) {
        let task = tasks[taskIndex];
        let subtasks = task['subtasks'];

        for (let j = 0; j < subtasks.length; j++) {
            let subtask = subtasks[j];
            let isChecked = subtask['state'] ? 'checked' : '';
            let subtaskHTML = `
                <div id="single_subtask_${taskIndex}_${j}" class="single_subtask">
                    <input onclick="updateProgressBar(${taskIndex}); saveCheckboxState(${taskIndex}, ${j})" class="subtask-checkbox" type="checkbox" ${isChecked}>
                    <p>${subtask['title']}</p>
                </div>
            `;
            subtasksContainer.innerHTML += subtaskHTML;
        }

        updateProgressBar(taskIndex);
    }
}


/**
 * Generates the HTML for displaying the detailed view of a task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateTaskDetails(task, i) {
    let taskJson = encodeURIComponent(JSON.stringify(task));
    return /*html*/`
    <div class="task-card-type-details">
        <div class="type-bg type-of-task">${task['taskCategory']}</div>
        <div class="close_and_change">
            <img onclick="closeDialogTask()" src="../assets/img/add_task/close.svg" alt="schließen">
        </div>
    </div>
    <div class="header_task_details">
        <h1>${task['title']}</h1>
        <p class="task-description">${task['description']}</p>
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
        <div class="task_details_subtasks" id="task_details_subtasks">
            <span>Subtasks</span>
            <div class="task_details_subtask" id="task_subtasks">
            </div>
        </div>
        <footer class="details_delete_edit">
            <div class="delete_task" onclick="deleteTask('${taskJson}, ${i}')">
                <img src="../assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <p>|</p>
            <div class="edit_task" onclick="editTask('${taskJson}', '${i}')">
                <img src="../assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </footer>
    </div>
    `;
}

async function deleteTask(taskJson, i) {
    let task = JSON.parse(decodeURIComponent(taskJson));
    let personalId = localStorage.getItem('userKey');
    console.log(i);
    // let response = await fetch(`${task}`, {

    //     method: "DELETE",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });
    // if (response.ok) {

    // } else {
    //     console.error('Fehler beim Löschen der Task:', response.statusText);
    // }
}

async function editTask(taskJson, i) {
    let task = JSON.parse(decodeURIComponent(taskJson));
    console.log(task);
    let container = document.getElementById('taskDetails');
    container.innerHTML = '';
    container.innerHTML = generateEditPopup(task);
    document.getElementById('title').value = task['title'];
    document.getElementById('description').value = task['description'];
    document.getElementById('date').value = task['date'];
    // document.getElementById('title').value = task['title'];
}

function generateEditPopup(task) {
    return `
    <div>
    <div class="add-task-section-edit">

        <div class="add-task-titel-container-edit">
            <form onsubmit="saveEditedTask()" action="">
                <p>Titel<span class="color-red">*</span></p>
                <input id="title" required class="margin-buttom" type="text" placeholder="Enter a title">
                <p>Description</p>
                <textarea id="description" class="margin-buttom" name="" id=""
                    placeholder="Enter a Description"></textarea>

                <p>Assigned to</p>
                <input onclick="openAssigned(event)" id="assignedSearch" type="search" onkeydown="filterContacts()" class="assigned-search"
                    placeholder="Select contacts to assign">
                <div onclick="event.stopPropagation()" class="assigned-contacts-container d-none" id="assignedContainer">

                </div>
                <div class="selected-contact d-none" id="selectedContact"></div>
        </div>
        <div class="add-task-date-container-edit">
            <p>Due date<span class="color-red">*</span></p>
            <input id="date" required class="margin-buttom" type="date">
            <p>Prio</p>
            <div class="margin-buttom add-task-prio">
                <div class="prio-selection-urgent" onclick="taskUrgent()" id="urgent">
                    <span>Urgent</span>
                    <img id="imgUrgent" class="prio-icons" src="./assets/img/add_task/arrowsTop.svg">
                </div>
                <div class="prio-selection-medium medium" onclick="taskMedium()" id="medium">
                    <span>Medium </span>
                    <img id="imgMedium" class="prio-icons" src="./assets/img/add_task/result_white.svg">
                </div>
                <div class="prio-selection-low" onclick="taskLow()" id="low">
                    <span>Low</span>
                    <img id="imgLow" class="prio-icons" src="./assets/img/add_task/arrowsButtom.svg">
                </div>
            </div>
            <p>Category<span class="color-red">*</span></p>
            <div class="custom-select" style="width:100%;">
                <select id="select">
                    <option value="0">Select task category</option>
                    <option value="1">Technical Task</option>
                    <option value="2">User Story</option>
                </select>
            </div>
            <p>Subtasks</p>
            <div class="subtasks-container">
                <input id="subtask" placeholder="Add new subtask" onkeypress="return event.keyCode!=13">
                <div class="subtasks-button">
                    <button onclick="addNewSubtasks()" type="button">+</button>
                </div>
            </div>
            <div class="subtasks-list">
                <ul id="subtasksList"></ul>
            </div>
        </div>

    </div>

    <div class="send-add-task-buttons">
        <div class="buttons">
            <button class="btn">OK<img src="assets/img/add_task/check.svg"></button>
        </div>
    </div>
    </form>
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
        renderGuestTaskBoard();
    }
    removeHighlight(category);
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

        renderTaskBoard()

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
async function dataUser(path = "", data = {}, method = "PATCH") {
    let response = await fetch(firebaseUrl + path + ".json", {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: method === "PATCH" ? JSON.stringify(data) : null,
    });
    return await response.json();
}


async function filterTasks() {
    let searchedTask = document.getElementById('inputField').value.toLowerCase();
    await compareTasks(searchedTask);
}


async function compareTasks(searchedTask) {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let user = localStorage.getItem('userKey');
    let pathUser = responseToJson['registered'][user];
    let tasks = pathUser['tasks'];

    for (let i = 0; i < tasks.length; i++) {
        let taskTitle = tasks[i]['title'].toLowerCase();
        let taskDescription = tasks[i]['description'].toLowerCase();

        let taskElement = document.querySelector(`.todo[data-index='${i}']`);

        if (taskElement) {
            if (searchedTask === "" || taskTitle.includes(searchedTask) || taskDescription.includes(searchedTask)) {
                taskElement.style.display = "block";
            } else {
                taskElement.style.display = "none";
            }
        }
    }
}


async function filterTasksMobile() {
    let searchedTask = document.getElementById('inputFieldMobile').value.toLowerCase();
    await compareTasks(searchedTask);
}
