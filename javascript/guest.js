/**
 * Renders the task board for guest users by iterating over guest tasks
 * and generating the HTML for each task.
 */
function renderGuestTaskBoard() {
    let guestTasks = JSON.parse(localStorage.getItem('guestTasks')) || [];

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

    let content = document.getElementById(`contacts${i}`);
    content.innerHTML = '';

    if (task['taskContacts'].length === 0) {
        content.innerHTML = '<p>No contacts available.</p>';
    } else {
        for (let j = 0; j < task['taskContacts'].length; j++) {
            let contact = task['taskContacts'][j];
            content.innerHTML += `
            <div class="arrange_assigned_to_contacts">
                <span class="user-icon" style="background-color: ${contact['color']};">${contact['initials']}</span>
                <p>${contact['name']}</p>
            </div>
            `;
        }
    }

    let subtasks = document.getElementById(`task_subtasks`);
    subtasks.innerHTML = '';

    if (task['subtasks'].length === 0) {
        subtasks.innerHTML = '<p>No subtasks available.</p>';
    } else {
        for (let k = 0; k < task['subtasks'].length; k++) {
            let subtask = task['subtasks'][k];
            let isChecked = subtask['state'] ? 'checked' : '';

            subtasks.innerHTML += `
            <div id="single_subtask_${i}_${k}" class="single_subtask">
                <input onclick="updateProgressBar(${i}); saveGuestCheckboxState(${i}, ${k})" class="subtask-checkbox" type="checkbox" ${isChecked}>
                <p>${subtask['title']}</p>
            </div>
            `;
        }
    }

    updateAllGuestsProgressBars();
    updateProgressBar(i);
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


function updateAllGuestsProgressBars() {
    for (let i = 0; i < guestTasks.length; i++) {
        let task = guestTasks[i];
        let subtasks = task['subtasks'];

        if (subtasks.length > 0) {
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
            let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
            if (subtasksAmount) {
                subtasksAmount.innerHTML = '0/0 Subtasks';
            }
            let progressBarContent = document.getElementById(`progress-bar-content-${i}`);
            if (progressBarContent) {
                progressBarContent.style.width = '0%';
            }
        }
    }
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


/**
 * Deletes a guest task from localStorage and re-renders the task board.
 * 
 * @param {number} index - The index of the task to delete.
 */
function deleteGuestTask(index) {
    let guestTasks = JSON.parse(localStorage.getItem('guestTasks')) || [];
    guestTasks.splice(index, 1);
    localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
    renderGuestTaskBoard();
    closeDialogTask()
}


function editTaskGuest(i) {
    let container = document.getElementById('taskDetails');
    container.innerHTML = '';
    let tasks = guestTasks[i];
    container.innerHTML = generateEditPopupGuest(tasks, i);
    console.log(tasks)

    let conatactsContent = document.getElementById(`selectedContact`);
    for (let j = 0; j < tasks['taskContacts'].length; j++) {
        let contact = tasks['taskContacts'][j];
        conatactsContent.innerHTML += `<div style="background-color: ${contact.color};" class="assigned-initials">${contact.initials}</div>`;
    }

    let subtasksContent = document.getElementById(`subtasksList${i}`);
    for (let k = 0; k < tasks['subtasks'].length; k++) {
        let contact = tasks['subtasks'][k];
        subtasksContent.innerHTML += generateSubtaskGuestHtml(contact, k);
    }
}


/**
 * This function saves the edited task for a guest user.
 * 
 * @param {number} i - The index of the task in the guestTasks list.
 */
function saveEditedTaskGuest(i) {
    let taskCategory = document.getElementById('select');
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    let guestTasks = JSON.parse(localStorage.getItem('guestTasks')) || [];

    guestTasks[i] = {
        ...guestTasks[i],
        taskCategory: taskCategory.options[taskCategory.selectedIndex].text,
        title: title.value,
        description: description.value,
        date: date.value,
        prio: prio,
        prioImg: prioImg,
        subtasks: subtasks,
        taskContacts: [...taskContacts]
    };

    localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
    window.location.reload();
}


function addNewSubtasksGuest(i) {
    let subtaskInput = document.getElementById('subtask');
    if (subtasks.length < 5) {
        if (subtaskInput.value.length >= 1) {
            let newSubtask = {
                'title': subtaskInput.value,
                'state': false
            };
            subtasks.push(newSubtask);
            subtaskInput.value = '';
            renderSubtasksListGuest(i);
        }
    }
}


/**
* This function renders the created subtasks and displays them in the content area.
*/
function renderSubtasksListGuest(i) {
    let content = document.getElementById(`subtasksList${i}`);
    content.innerHTML = '';

    if (subtasks.length === 0) {
        content.innerHTML = '<p>No subtasks available.</p>';
    } else {
        for (let j = 0; j < subtasks.length; j++) {
            let subtask = subtasks[j];
            content.innerHTML += generateSubtaskGuestHtml(subtask, j);
        }
    }
}


/**
 * This function deletes a subtask.
 * 
 * @param {number} i - This is the index of the subtask.
 */
function deleteSubtaskGuest(i) {
    subtasks.splice(i, 1);
    renderSubtasksListGuest(i);
}


/**
 * This function opens the pop-up window for contacts in the "Assigned to" section.
 * 
 * @param {Event} event - The event object representing the user interaction.
 * @param {number} i - The index of the contact in the contact list.
 */
function openAssignedGuest(event, i) {
    event.stopPropagation();
    document.getElementById('assignedContainer').classList.toggle('d-none');
    document.getElementById(`selectedContact`).classList.toggle('d-none');
    renderContactsAddTaskGuest(i);
}

