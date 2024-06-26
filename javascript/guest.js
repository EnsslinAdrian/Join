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
    showGuestTaskContacts(task, i);
    showGuestTaskSubtasks(task, i);
    updateAllGuestsProgressBars();
    updateProgressBar(i);
}


/**
 * This function displays the contacts associated with a guest task.
 * 
 * This function clears the content of the specified element and populates it with the contacts
 * associated with the given task. If no contacts are available, it displays a message indicating this.
 *
 * @param {Object} task - The task object containing the contacts.
 * @param {number} i - The index of the task.
 */
function showGuestTaskContacts(task, i) {
    let content = document.getElementById(`contacts${i}`);
    content.innerHTML = '';
    if (task['taskContacts'].length === 0) {
        content.innerHTML = '<p>No contacts available.</p>';
    } else {
        for (let j = 0; j < task['taskContacts'].length; j++) {
            let contact = task['taskContacts'][j];
            content.innerHTML += `
            <div class="arrange_assigned_to_contacts" onclick="toggleCheckbox('${i}', '${contact}')">
                <span class="user-icon" style="background-color: ${contact['color']};">${contact['initials']}</span>
                <p>${contact['name']}</p>
            </div>
            `;
        }
    }
}


/**
 * This function displays the subtasks associated with a guest task.
 * 
 * This function clears the content of the specified element and populates it with the subtasks
 * associated with the given task. If no subtasks are available, it displays a message indicating this.
 * Each subtask is rendered with a checkbox that updates the progress bar and saves its state when clicked.
 *
 * @param {Object} task - The task object containing the subtasks.
 * @param {number} i - The index of the task.
 */
function showGuestTaskSubtasks(task, i) {
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
}


/**
 * This function renders the checkboxes for a guest task's subtasks and updates the progress bar.
 * 
 * This function retrieves the subtasks for a specified task, clears the subtasks container,
 * and then renders each subtask with a checkbox. It also updates the progress bar for the task.
 *
 * @param {number} taskIndex - The index of the task.
 */
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
        renderGuestSubtasksCheckbox(subtasks, j, taskIndex, subtasksContainer);
    }
    updateProgressBar(taskIndex);
}


/**
 * This function renders a single subtask with a checkbox for a guest task.
 * 
 * This function generates the HTML for a subtask with a checkbox and appends it to the subtasks container.
 * It also sets up the checkbox to update the progress bar and save its state when clicked.
 *
 * @param {Array} subtasks - The array of subtasks for the task.
 * @param {number} j - The index of the subtask.
 * @param {number} taskIndex - The index of the task.
 * @param {HTMLElement} subtasksContainer - The container element where the subtasks will be rendered.
 */
function renderGuestSubtasksCheckbox(subtasks, j, taskIndex, subtasksContainer) {
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


/**
 * This function saves the state of a guest's subtask checkbox and updates the progress bar.
 * 
 * This function updates the state of a subtask's checkbox for a specified task and subtask index.
 * It also saves the updated guest tasks to localStorage and updates the progress bar for the task.
 *
 * @param {number} taskIndex - The index of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 */
function saveGuestCheckboxState(taskIndex, subtaskIndex) {
    let checkbox = document.querySelector(`#single_subtask_${taskIndex}_${subtaskIndex} .subtask-checkbox`);
    let isChecked = checkbox.checked;

    guestTasks[taskIndex]['subtasks'][subtaskIndex]['state'] = isChecked;

    localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
    updateProgressBar(taskIndex);
}


/**
 * This function updates the progress bars for all guest tasks.
 * 
 * This function iterates through all guest tasks and updates their progress bars
 * based on the completion status of their subtasks.
 */
function updateAllGuestsProgressBars() {
    for (let i = 0; i < guestTasks.length; i++) {
        let task = guestTasks[i];
        let subtasks = task['subtasks'];

        if (subtasks.length > 0) {
            updateProgressBarAboveZero(subtasks, i);
        } else {
            updateProgressBarBelowZero(subtasks, i);
        }
    }
}


/**
 * This function updates the progress bar for a task with one or more subtasks.
 * 
 * This function calculates the progress of completed subtasks for a specified task
 * and updates the corresponding progress bar and subtasks amount display.
 *
 * @param {Array} subtasks - The array of subtasks for the task.
 * @param {number} i - The index of the task.
 */
function updateProgressBarAboveZero(subtasks, i) {
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
}


/**
 * This function updates the progress bar for a task with no subtasks.
 * 
 * This function sets the progress bar to 0% and displays '0/0 Subtasks' for a specified task.
 *
 * @param {number} i - The index of the task.
 */
function updateProgressBarBelowZero() {
    let subtasksAmount = document.getElementById(`completed-subtasks-${i}`);
    if (subtasksAmount) {
        subtasksAmount.innerHTML = '0/0 Subtasks';
    }
    let progressBarContent = document.getElementById(`progress-bar-content-${i}`);
    if (progressBarContent) {
        progressBarContent.style.width = '0%';
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


/**
 * This function edits the specified task for a guest user by generating the edit popup and populating it with task details.
 * 
 * This function clears the task details container, generates the edit popup HTML for the specified task, and
 * populates it with the task's contacts and subtasks.
 *
 * @param {number} i - The index of the task to be edited.
 */
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


/**
 * This function adds a new subtask to the list of subtasks for a guest user.
 * 
 * This function checks if the subtask input is valid and the total number of subtasks
 * is less than 5. If both conditions are met, it adds the new subtask to the list
 * and renders the updated list.
 *
 * @param {number} i - The index of the current task.
 */
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

