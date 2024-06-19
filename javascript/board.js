let currentDraggedTask = null;
let checkboxStates = {};
let currentTaskId;

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

        subtasks.innerHTML += `
        <div id="single_subtask_${i}_${k}" class="single_subtask">
            <input onclick="updateProgressBar(${i}); saveCheckboxState(${i}, ${k})" class="subtask-checkbox" type="checkbox" ${isChecked}>
            <p>${subtask['title']}</p>
        </div>
        `;
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


async function updateAllProgressBars() {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let userKey = localStorage.getItem('userKey');

    let tasks = responseToJson['registered'][userKey]['tasks'];

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let subtasks = task['subtasks'];

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


async function deleteTask(taskJson, i) {
    let personalId = localStorage.getItem('userKey');
    const url = `https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/registered/${personalId}/tasks/${i}.json`;
    console.log('URL für den DELETE-Aufruf:', url);

    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Fehler beim Löschen des Tasks:', response.status, errorText);
            throw new Error(`Fehler beim Löschen des Tasks. Status: ${response.status}, Antwort: ${errorText}`);
        }
        window.location.reload();
    } catch (error) {
        console.error('Fehler beim Löschen des Tasks:', error);
        alert('Fehler beim Löschen des Tasks: ' + error.message);
    }
}


// Die Hauptfunktion zum Bearbeiten eines Tasks
async function editTask(taskJson, i) {
    let task = JSON.parse(decodeURIComponent(taskJson));
    let container = document.getElementById('taskDetails');
    container.innerHTML = '';

    container.innerHTML = generateEditPopup(task, i);
    currentTaskId = i;

    document.getElementById('title').value = task['title'];
    document.getElementById('description').value = task['description'];
    document.getElementById('date').value = task['date'];
    document.getElementById('select').innerHTML = generateSelectOptions(task['taskCategory']);

    subtasks = task['subtasks'] || [];

    renderSubtasks(task['subtasks']);
    taskContacts = task['taskContacts'];
    renderAddTaskContactInitials();
    setPriority(task['prio']);
}

function setPriority(prio) {
    switch (prio) {
        case 'Urgent':
            taskUrgent();
            break;
        case 'Medium':
            taskMedium();
            break;
        case 'Low':
            taskLow();
            break;
        default:
            console.log('Unbekannte Priorität:', prio);
            break;
    }
}

function generateSelectOptions(selectedCategory) {
    const categories = {
        '0': 'Select task category',
        '1': 'Technical Task',
        '2': 'User Story'
    };
    return Object.keys(categories).map(key =>
        `<option value="${key}" ${key === selectedCategory.toString() ? 'selected' : ''}>${categories[key]}</option>`
    ).join('');
}

function renderAddTaskContactInitials() {
    let content = document.getElementById('selectedContact');
    content.innerHTML = "";

    if (taskContacts.length > 0) {
        taskContacts.forEach(contact => {
            content.innerHTML += generateAddTaskContactInitialsHTML(contact);
        });
    } else {
        console.log('Keine Kontakte zu rendern.');
    }
}

function generateAddTaskContactInitialsHTML(contact) {
    return `<div style="background-color: ${contact.color};" class="assigned-initials">${contact.initials}</div>`;
}

function renderSubtasks(subtasks) {
    let subtasksList = document.getElementById('subtasksList');
    subtasksList.innerHTML = '';

    subtasks.forEach((subtask, index) => {
        subtasksList.innerHTML += generateSubtaskHtml(subtask, index);
    });
}


async function saveEditedTask(i) {
    const userKey = localStorage.getItem('userKey');
    if (!userKey) {
        console.log("Kein Benutzer-Schlüssel verfügbar.");
        return;
    }

    const url = `https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/registered/${userKey}/tasks/${i}.json`;

    try {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const taskCategoryElement = document.getElementById('select');
        const taskCategory = taskCategoryElement.options[taskCategoryElement.selectedIndex].text;
        const priorityElement = document.getElementById('priority');
        const priority = priorityElement ? priorityElement.value : 'Medium';

        const updatedTask = {
            title,
            description,
            date,
            taskCategory,
            priority
        };

        console.log('Updated Task:', updatedTask);

        const updateResponse = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (updateResponse.ok) {
            console.log('Update Response:', await updateResponse.json());
            window.location.reload();
        } else {
            console.log("Update fehlgeschlagen. Antwortstatus: ", updateResponse.status);
            return;
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
    }
}

function toggleAssigned(event) {
    event.stopPropagation();

    let assignedContainer = document.getElementById('assignedContainer');
    let selectedContact = document.getElementById('selectedContact');

    assignedContainer.classList.toggle('d-none');
    selectedContact.classList.toggle('selected-contact');
    selectedContact.classList.toggle('d-none');

    if (!assignedContainer.classList.contains('d-none')) {
        renderContactsBoardPage();
    }
}


async function renderContactsBoardPage() {
    if (window.location.pathname.endsWith("board.html")) {
        let response = await fetch(firebaseUrl + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('assignedContainer');
        content.innerHTML = '';
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);

        for (let i = 0; i < contactsArray.length; i++) {
            let contact = contactsArray[i];
            let initialsBgColor = getRandomColor();

            content.innerHTML += generateBoardTaskContactHtml(contact, i, initialsBgColor);
        }
        content.classList.remove('d-none');
    }
}

function generateBoardTaskContactHtml(contact, i, color) {
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');

    let isContactAdded = taskContacts.some(c => c.name === contactName);

    return `
    <div class="assigned-contact" id="contactTask${i}">
        <div class="contact-name">
            <div style="background-color: ${color};" class="assigned-initials">${initials}</div>
            <p>${contactName}</p>
        </div>
        <input id="taskCheckbox${i}" onclick="addContactTask('${contactName}', '${initials}', ${i}, '${color}')" class="checkbox" type="checkbox" ${isContactAdded ? 'checked' : ''}>
    </div>
    `;
}

async function fetchTasks() {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let userKey = localStorage.getItem('userKey');
    let tasks = responseToJson['registered'][userKey]['tasks'];
    return tasks;
}

/**
 * Updates the HTML content for the task board by calling functions
 * to update each section: ToDo, In Progress, Awaiting Feedback, and Done.
 */
async function updateHTML() {
    let tasks = await fetchTasks();
    updateTodo(tasks);
    updateInProgress(tasks);
    updateAwaitFeedback(tasks);
    updateDone(tasks);
}


/**
 * Updates the HTML content for the "ToDo" section by filtering tasks
 * with the category 'todo' and generating their HTML.
 */
function updateTodo(tasks) {
    let todo = tasks.filter(t => t['category'] == 'todo');

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
function updateInProgress(tasks) {
    let inProgress = tasks.filter(t => t['category'] == 'in-progress');

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
function updateAwaitFeedback(tasks) {
    let awaitFeedback = tasks.filter(t => t['category'] == 'await-feedback');

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
function updateDone(tasks) {
    let done = tasks.filter(t => t['category'] == 'done');

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
    if (currentDraggedTask == null) {
        return;
    }
    
    if (localStorage.getItem('username') !== 'Guest') {
        let task = await getTaskFromDatabase(currentDraggedTask);
        if (!task) {
            return;
        }
        task['category'] = category;
        await putData(currentDraggedTask, task); // Annahme: putData() aktualisiert den Task in der Datenbank
        updateHTML();
        currentDraggedTask = null;
    } else {
        let guestTasks = JSON.parse(localStorage.getItem('guestTasks')) || {};
        if (!guestTasks[currentDraggedTask]) {
            return;
        }
        guestTasks[currentDraggedTask]['category'] = category;
        localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
        currentDraggedTask = null;
        updateHTML();
        renderGuestTaskBoard();
    }
    removeHighlight(category);
}


async function getTaskFromDatabase(taskId) {
    let userKey = localStorage.getItem('userKey');
    let response = await fetch(`${firebaseUrl}/registered/${userKey}/tasks/${taskId}.json`);
    let task = await response.json();
    return task;
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
async function putData(taskId, task) {
    try {
        let userKey = localStorage.getItem('userKey');
        await fetch(`${firebaseUrl}/registered/${userKey}/tasks/${taskId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        renderTaskBoard();
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
