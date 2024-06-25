let currentDraggedTask = null;
let checkboxStates = {};
let currentTaskId;


/**
 * This function opens the 'Add Task' interface. If the viewport width is less than or equal to 1100px,
 * 
 * it redirects to 'add_task.html'. Otherwise, it displays a popup for adding a task.
 */
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


/**
 * This function closes the 'Add Task' popup by adding the 'd-none' class to the container.
 */
function closeAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.add('d-none');
}


/**
 * This function cancels the 'Add Task' operation by initiating a slide-out animation.
 * 
 * Once the animation ends, the popup is closed.
 */
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
    generateTaskContactsforDetails(task, i);
    generateTaskSubtasksforDetails(task, i);
    updateAllProgressBars();
    updateProgressBar(i);
}


/**
 * This function updates the progress bar to reflect the current state of completed subtasks.
 * 
 * @param {number} i - The index of the task.
 */
function updateProgressBar(i) {
    let allSubtasks = document.querySelectorAll(`#task_subtasks .single_subtask input[type="checkbox"]`).length;
    let completedSubtasks = document.querySelectorAll(`#task_subtasks .single_subtask input[type="checkbox"]:checked`).length;

    let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
    if (!subtasksAmount) {
        return;
    }
    subtasksAmount.innerHTML = `${completedSubtasks}/${allSubtasks} Subtasks`;

    let progress = (completedSubtasks / allSubtasks) * 100;
    let progressBarContent = document.getElementById(`progress-bar-content-${i}`);
    
    if (!progressBarContent) {
        return;
    }
    progressBarContent.style.width = progress + '%';
}


/**
 * This function saves the state of a subtask checkbox.
 * 
 * @param {number} taskIndex - This is the index of the task.
 * @param {number} subtaskIndex - This is the index of the subtask.
 * @returns {Promise<void>} A promise that resolves when the checkbox state is saved.
 */
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


/**
 * This function fetches all tasks from the server and updates the progress bars for all tasks.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves when all progress bars are updated.
 */
async function updateAllProgressBars() {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();
    let userKey = localStorage.getItem('userKey');
    let tasks = responseToJson['registered'][userKey]['tasks'];

    renderAmountOfAllSubtasks(tasks);
}


/**
 * This function renders the progress and amount of all subtasks for each task.
 * 
 * @param {Array<Object>} tasks - This is an array of task objects.
 */
function renderAmountOfAllSubtasks(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let subtasks = task['subtasks'];

        if (Array.isArray(subtasks)) {
            let allSubtasks = subtasks.length;
            let completedSubtasks = subtasks.filter(subtask => subtask['state']).length;
            let progress = (completedSubtasks / allSubtasks) * 100;

            let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
            if (subtasksAmount) {
                subtasksAmount.innerHTML = `${completedSubtasks}/${allSubtasks} Subtasks`;
            }

            let progressBarContent = document.getElementById(`progress-bar-content-${i}`);
            if (progressBarContent) {
                progressBarContent.style.width = progress + '%';
            }
        } else {
            // Handle case where there are no subtasks
            let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
            if (subtasksAmount) {
                subtasksAmount.innerHTML = 'No Subtasks';
            }

            let progressBarContent = document.getElementById(`progress-bar-content-${i}`);
            if (progressBarContent) {
                progressBarContent.style.width = '0%';
            }
        }
    }
}


/**
 * This function checks if a specific subtask is checked.
 * 
 * @param {number} taskIndex - This is the index of the task.
 * @param {number} subtaskIndex - This is the index of the subtask.
 * @returns {boolean} True if the subtask is checked, false otherwise.
 */
function isSubtaskChecked(taskIndex, subtaskIndex) {
    return checkboxStates[taskIndex] && checkboxStates[taskIndex][subtaskIndex];
}


/**
 * This function renders the checkboxes for subtasks of a given task.
 * 
 * @async
 * @function renderCheckbox
 * @param {number} taskIndex - The index of the task to render subtasks for.
 * @returns {Promise<void>}
 */
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

    subtaskCheckBox(taskIndex, tasks, subtasksContainer);
}


/**
 * This function generates and inserts HTML for subtask checkboxes into the subtasks container.
 * 
 * @function subtaskCheckBox
 * @param {number} taskIndex - The index of the task containing the subtasks.
 * @param {Array} tasks - The list of tasks retrieved from the database.
 * @param {HTMLElement} subtasksContainer - The container element for subtasks.
 */
function subtaskCheckBox(taskIndex, tasks, subtasksContainer) {
    if (tasks[taskIndex]) {
        let task = tasks[taskIndex];
        let subtasks = task['subtasks'];
        subtasksContainer.innerHTML = '';

        if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
            for (let j = 0; j < subtasks.length; j++) {
                let subtask = subtasks[j];
                let isChecked = subtask['state'] ? 'checked' : '';
                let subtaskHTML = subtaskCheckboxHtml(taskIndex, j, subtask, isChecked);
                subtasksContainer.innerHTML += subtaskHTML;
            }
        } else {
            subtasksContainer.innerHTML = '<p>No subtasks available</p>';
        }
        updateProgressBar(taskIndex);
    }
}



/**
 * This function deletes a task from the database and reindexes the remaining tasks.
 * 
 * @param {Object} taskJson - This is the task data in JSON format.
 * @param {number} i - This is the index of the task to be deleted.
 * @returns {Promise<void>} A promise that resolves when the task is deleted.
 */
async function deleteTask(taskJson, i) {
    let personalId = localStorage.getItem('userKey');
    try {
        await deleteTaskByUrl(personalId, i);
        await reindexAndSaveTasks(personalId, i);
        window.location.reload();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task: ' + error.message);
    }
}

/**
 * Deletes a specific task by URL.
 * 
 * @param {string} personalId - The user's personal ID.
 * @param {number} i - The index of the task to be deleted.
 */
async function deleteTaskByUrl(personalId, i) {
    const taskUrl = `https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/registered/${personalId}/tasks/${i}.json`;
    const response = await fetch(taskUrl, { method: 'DELETE' });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting task:', response.status, errorText);
        throw new Error(`Error deleting task. Status: ${response.status}, Response: ${errorText}`);
    }
}

/**
 * Reindexes the remaining tasks and updates the database.
 * 
 * @param {string} personalId - The user's personal ID.
 * @param {number} i - The index of the task that was deleted.
 */
async function reindexAndSaveTasks(personalId, i) {
    const tasksUrl = `https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/registered/${personalId}/tasks.json`;
    const tasksResponse = await fetch(tasksUrl);
    const tasks = await tasksResponse.json();

    if (tasks) {
        const taskEntries = Object.entries(tasks);
        const updatedTasks = taskEntries
            .filter(([key]) => key !== i.toString())
            .reduce((acc, [key, task], index) => {
                acc[index] = task;
                return acc;
            }, {});

        // Clear existing tasks in the database
        await fetch(tasksUrl, { method: 'DELETE' });

        // Update the tasks with the newly indexed values
        await fetch(tasksUrl, {
            method: 'PUT',
            body: JSON.stringify(updatedTasks)
        });
    }
}

/**
 * This function edits the task with the specified index.
 * 
 * @param {string} taskJson - The JSON string of the task to be edited.
 * @param {number} i - The index of the task to be edited.
 * @returns {Promise<void>} A promise that resolves when the task is edited.
 */
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


/**
 * This function sets the priority of the task.
 * 
 * @param {string} prio - The priority of the task (Urgent, Medium, Low).
 */
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
            break;
    }
}


/**
 * This function generates HTML options for task categories.
 * 
 * @param {string} selectedCategory - The currently selected category.
 * @returns {string} HTML string of option elements.
 */
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


/**
 * This function renders the initials of the contacts assigned to the task.
 */
function renderAddTaskContactInitials() {
    let content = document.getElementById('selectedContact');
    content.innerHTML = "";

    if (taskContacts.length > 0) {
        taskContacts.forEach(contact => {
            content.innerHTML += generateAddTaskContactInitialsHTML(contact);
        });
    }
}


/**
 * This function renders the list of subtasks for the task.
 * 
 * @param {Array<Object>} subtasks - The array of subtask objects.
 */
function renderSubtasks(subtasks) {
    let subtasksList = document.getElementById('subtasksList');
    subtasksList.innerHTML = '';

    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
        subtasks.forEach((subtask, index) => {
            subtasksList.innerHTML += generateSubtaskHtml(subtask, index);
        });
    } else {
        subtasksList.innerHTML = '<p>No subtasks available</p>';
    }
}


/**
 * Retrieves the user key from local storage.
 * @returns {string|null} The user key.
 */
function getUserKey() {
    const userKey = localStorage.getItem('userKey');
    if (!userKey) {
    }
    return userKey;
}

/**
 * Generates the URL for the task.
 * @param {string} userKey - The user key.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} The generated URL.
 */
function generateTaskUrl(userKey, taskIndex) {
    return `https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/registered/${userKey}/tasks/${taskIndex}.json`;
}


/**
 * Collects the form data for the task.
 * @returns {object} The collected task data.
 */
function collectFormData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const taskCategoryElement = document.getElementById('select');
    const taskCategory = taskCategoryElement.options[taskCategoryElement.selectedIndex].text;
    const priority = prio || 'Medium';
    const priorityImg = prioImg || './assets/img/add_task/result.svg';

    // Verwenden der globalen Variable `taskContacts`
    const assignedContacts = taskContacts;

    // Sammeln der Unteraufgaben
    const subtasks = [];
    document.querySelectorAll('#subtasksList li').forEach(subtaskElement => {
        const inputElement = subtaskElement.querySelector('input');
        subtasks.push({
            title: subtaskElement.textContent.trim(),
            state: inputElement ? inputElement.checked : false
        });
    });

    return {
        title,
        description,
        date,
        taskCategory,
        priority,
        priorityImg,
        taskContacts: assignedContacts, // Hier verwenden
        subtasks
    };
}


/**
 * Updates the task in the database.
 * @param {string} url - The URL for the API request.
 * @param {object} updatedTask - The updated task data.
 * @returns {Promise<Response>} The response from the fetch request.
 */
async function updateTaskInDatabase(url, updatedTask) {
    try {
        const response = await fetch(url, {
            method: 'PATCH', // Verwenden Sie PATCH, um den vorhandenen Eintrag zu aktualisieren
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update fehlgeschlagen. Antwortstatus: ", response.status, errorText);
            throw new Error(`Update failed with status ${response.status}: ${errorText}`);
        }

        return response;
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
        throw error;
    }
}


/**
 * This function saves the edited task.
 * @param {Event} event - The form submission event.
 * @param {number} taskIndex - The index of the task.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveEditedTask(taskIndex) {
    const userKey = getUserKey();
    if (!userKey) {
        return;
    }
    const url = generateTaskUrl(userKey, taskIndex); // Verwenden Sie die richtige URL
    const updatedTask = collectFormData();

    try {
        const updateResponse = await updateTaskInDatabase(url, updatedTask);

        if (updateResponse.ok) {
            window.location.reload();
        } else {
            const errorText = await updateResponse.text();
            console.error("Update fehlgeschlagen. Antwortstatus: ", updateResponse.status, errorText);
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
    }
}


/**
 * This function toggles the visibility of the assigned container and selected contact elements.
 * 
 * Stops the propagation of the event.
 * @param {Event} event - The event object.
 */
function toggleAssigned(event) {
    event.stopPropagation();

    let assignedContainer = document.getElementById('assignedContainer');

    assignedContainer.classList.toggle('d-none');

    if (!assignedContainer.classList.contains('d-none')) {
        renderContactsBoardPage();
    }
}


/**
 * This function fetches the contacts from the server and renders them on the board page.
 * 
 * The contacts are displayed in the assigned container element.
 * @returns {Promise<void>} A promise that resolves when the contacts are rendered.
 */
async function renderContactsBoardPage() {
    if (window.location.pathname.endsWith("board.html")) {
        let response = await fetch(firebaseUrl + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('assignedContainer');
        content.innerHTML = '';
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);

        renderBoardTaskContactHtml(contactsArray, content);

        content.classList.remove('d-none');
    }
}


/**
 * This function renders the HTML for each contact in the contacts array and adds it to the content element.
 * 
 * @param {Array} contactsArray - The array of contact objects.
 * @param {HTMLElement} content - The container element where the contacts will be rendered.
 */
function renderBoardTaskContactHtml(contactsArray, content) {
    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
        let initialsBgColor = getRandomColor();

        content.innerHTML += generateBoardTaskContactHtml(contact, i, initialsBgColor);
    }
}


/**
 * This function generates the HTML for a task contact on the board.
 * 
 * @param {Object} contact - The contact object.
 * @param {number} i - The index of the contact.
 * @param {string} color - The color associated with the contact.
 * @returns {string} The HTML string for the contact.
 */
function generateBoardTaskContactHtml(contact, i, color) {
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');

    let isContactAdded = false;
    if (Array.isArray(taskContacts)) {
        isContactAdded = taskContacts.some(c => c.name === contactName);
    }

    return generateBoardsContactHtml(contactName, initials, i, color, isContactAdded);
}


/**
 * This function fetches the tasks from the server for the current user.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
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
 * This function moves the currently dragged task to the specified category.
 * 
 * This function handles both guest and registered users.
 * 
 * @param {string} category - The category to move the task to.
 * @returns {Promise<void>} A promise that resolves when the task has been moved.
 */
async function moveTo(category) {
    if (currentDraggedTask == null) {
        return;
    }
    if (localStorage.getItem('username') !== 'Guest') {
        moveToNotGuestUser(category, currentDraggedTask);
    } else {
        moveToGuestUser(category, currentDraggedTask)
    }
    removeHighlight(category);
}


/**
 * This function moves the currently dragged task to the specified category for registered users.
 * 
 * @param {string} category - The category to move the task to.
 * @param {string} currentDraggedTask - The ID of the currently dragged task.
 * @returns {Promise<void>} A promise that resolves when the task has been moved and updated in the database.
 */
async function moveToNotGuestUser(category, currentDraggedTask) {
    let task = await getTaskFromDatabase(currentDraggedTask);
    if (!task) {
        return;
    }
    task['category'] = category;
    await putData(currentDraggedTask, task); // Annahme: putData() aktualisiert den Task in der Datenbank
    updateHTML();
    currentDraggedTask = null;
}


/**
 * This function moves the currently dragged task to the specified category for guest users.
 * 
 * @param {string} category - The category to move the task to.
 * @param {string} currentDraggedTask - The ID of the currently dragged task.
 */
function moveToGuestUser(category, currentDraggedTask) {
    let guestTasks = JSON.parse(localStorage.getItem('guestTasks')) || {};
    if (!guestTasks[currentDraggedTask]) {
        return;
    }
    guestTasks[currentDraggedTask]['category'] = category;
    localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
    updateHTML();
    renderGuestTaskBoard();
    currentDraggedTask = null;
}


/**
 * This function retrieves a task from the database based on the provided task ID.
 * 
 * @param {number|string} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the task object.
 */
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


/**
 * This function filters tasks based on the search input value from the desktop input field.
 * 
 * @returns {Promise<void>} A promise that resolves when the tasks are filtered.
 */
async function filterTasks() {
    let searchedTask = document.getElementById('inputField').value.toLowerCase();
    await compareTasks(searchedTask);
}


/**
 * This function compares the searched task with tasks in the database and filters them based on the title and description.
 * 
 * @param {string} searchedTask - The task string to search for.
 * @returns {Promise<void>} A promise that resolves when the tasks are filtered.
 */
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

        compareTaskTitleAndDescription(searchedTask, taskElement, taskTitle, taskDescription)
    }
}


/**
 * This function compares the searched task string with the task's title and description, and updates the task element's display based on the match.
 * 
 * @param {string} searchedTask - The task string to search for.
 * @param {HTMLElement} taskElement - The DOM element representing the task.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 */
function compareTaskTitleAndDescription(searchedTask, taskElement, taskTitle, taskDescription) {
    if (taskElement) {
        if (searchedTask === "" || taskTitle.includes(searchedTask) || taskDescription.includes(searchedTask)) {
            taskElement.style.display = "block";
        } else {
            taskElement.style.display = "none";
        }
    }
}


/**
 * This function filters tasks based on the search input value from the mobile input field.
 * 
 * @returns {Promise<void>} A promise that resolves when the tasks are filtered.
 */
async function filterTasksMobile() {
    let searchedTask = document.getElementById('inputFieldMobile').value.toLowerCase();
    await compareTasks(searchedTask);
}