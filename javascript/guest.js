/**
 * Renders the task board for guest users by iterating over guest tasks
 * and generating the HTML for each task.
 */
async function renderGuestTaskBoard() {

    document.getElementById('todo').innerHTML = '';
    document.getElementById('in-progress').innerHTML = '';
    document.getElementById('await-feedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';

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

    updateAllGuestsProgressBars();
}


/**
 * Generates the HTML for a guest user's task card on the board page.
 * 
 * @param {Object} element - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateGuestTodoHTML(element, i) {
    return /*html*/`
    <div id="task${i}" draggable="true" ondragstart="startDragging(${i})" class="todo task-item" data-index="${i}">
        <div class="task-card" onclick="openDialogGuestTask(${i})">
        <div class="task-card-type">
                <div class="type-bg" style="background-color: blue;">${element['taskCategory']}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description shorter_description">${element['description']}</p>
            <div class="progress" id="progress">
                <div class="progress-bar">
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
 * Opens the task dialog for a guest user's task and shows the detailed view.
 * 
 * @param {number} i - The index of the task in the guest task list.
 */
function openDialogGuestTask(i) {
    document.getElementById('dialog').classList.remove('d_none');
    showGuestTaskDetails(guestTasks[i], i);
    updateProgressBar(i);
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

    renderGuestCheckbox(i);
    renderGuestTaskContacts(task['taskContacts'], i);
    renderGuestSubtasks(task['subtasks'], i);

    updateAllGuestsProgressBars();
    updateProgressBar(i);
}

/**
 * Renders the contacts for a guest task.
 * 
 * @param {Array} contacts - The list of contacts.
 * @param {number} taskId - The index of the task.
 */
function renderGuestTaskContacts(contacts, taskId) {
    let content = document.getElementById(`contacts${taskId}`);
    content.innerHTML = '';

    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        content.innerHTML += `
        <div class="arrange_assigned_to_contacts">
            <span class="user-icon" style="background-color: ${contact['color']};">${contact['initials']}</span>
            <p> ${contact['name']}</p>
        </div>
        `;
    }
}

/**
 * Renders the subtasks for a guest task.
 * 
 * @param {Array} subtasks - The list of subtasks.
 * @param {number} taskId - The index of the task.
 */
function renderGuestSubtasks(subtasks, taskId) {
    let subtasksContainer = document.getElementById(`task_subtasks`);
    subtasksContainer.innerHTML = '';

    for (let k = 0; k < subtasks.length; k++) {
        let subtask = subtasks[k];
        let isChecked = subtask['state'] ? 'checked' : '';

        subtasksContainer.innerHTML += `
        <div id="single_subtask_${taskId}_${k}" class="single_subtask">
            <input onclick="updateProgressBar(${taskId}); saveGuestCheckboxState(${taskId}, ${k})" class="subtask-checkbox" type="checkbox" ${isChecked}>
            <p>${subtask['title']}</p>
        </div>
        `;
    }
}


function renderGuestCheckbox(taskIndex) {
    let subtasksContainer = document.getElementById('task_subtasks');
    if (!subtasksContainer) {
        console.error('task_subtasks element not found');
        return;
    }

    let task = guestTasks[taskIndex];
    let subtasks = task['subtasks'];

    subtasksContainer.innerHTML = '';

    for (let j = 0; j < subtasks.length; j++) {
        let subtask = subtasks[j];
        let isChecked = subtask['state'] ? 'checked' : '';
        let subtaskHTML = `
            <div id="single_subtask_${taskIndex}_${j}" class="single_subtask">
                <input onclick="updateProgressBar(${taskIndex}); saveGuestCheckboxState(${taskIndex}, ${j})" class="subtask-checkbox" type="checkbox" ${isChecked}>
                <p>${subtask['title']}</p>
            </div>
        `;
        subtasksContainer.innerHTML += subtaskHTML;
    }

    updateProgressBar(taskIndex);
}


function saveGuestCheckboxState(taskIndex, subtaskIndex) {
    let checkbox = document.querySelector(`#single_subtask_${taskIndex}_${subtaskIndex} .subtask-checkbox`);
    let isChecked = checkbox.checked;

    guestTasks[taskIndex]['subtasks'][subtaskIndex]['state'] = isChecked;

    localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
    updateProgressBar(taskIndex);
}


/**
 * Updates the progress bars for all guest tasks.
 */
function updateAllGuestsProgressBars() {
    for (let i = 0; i < guestTasks.length; i++) {
        updateGuestProgressBar(i, guestTasks[i]);
    }
}

/**
 * Updates the progress bar for a single guest task.
 * 
 * @param {number} index - The index of the task in the guest task list.
 * @param {Object} task - The task object containing the task details.
 */
function updateGuestProgressBar(index, task) {
    let subtasks = task['subtasks'];

    if (subtasks.length > 0) {
        let allSubtasks = subtasks.length;
        let completedSubtasks = subtasks.filter(subtask => subtask['state']).length;

        let progress = (completedSubtasks / allSubtasks) * 100;

        updateGuestSubtasksAmount(index, completedSubtasks, allSubtasks);
        updateGuestProgressBarContent(index, progress);
    } else {
        updateGuestSubtasksAmount(index, 0, 0);
        updateGuestProgressBarContent(index, 0);
    }
}

/**
 * Updates the HTML element showing the amount of completed subtasks.
 * 
 * @param {number} index - The index of the task in the guest task list.
 * @param {number} completed - The number of completed subtasks.
 * @param {number} total - The total number of subtasks.
 */
function updateGuestSubtasksAmount(index, completed, total) {
    let subtasksAmount = document.getElementById(`completed-subtasks-${index}`);
    if (subtasksAmount) {
        subtasksAmount.innerHTML = `${completed}/${total} Subtasks`;
    }
}

/**
 * Updates the width of the progress bar content.
 * 
 * @param {number} index - The index of the task in the guest task list.
 * @param {number} progress - The progress percentage.
 */
function updateGuestProgressBarContent(index, progress) {
    let progressBarContent = document.getElementById(`progress-bar-content-${index}`);
    if (progressBarContent) {
        progressBarContent.style.width = progress + '%';
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
            <div class="delete_task" onclick="deleteTask(${i})">
                <img src="../assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <p>|</p>
            <div class="edit_task" onclick="editTask(${i})">
                <img src="../assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </footer>
    </div>
    `;
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