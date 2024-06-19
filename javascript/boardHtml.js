/**
 * This function generates the HTML for the Add_task.html page.
 */
function generateAddTaskHtml() {
    return `
    <div>
    <h1>Add Task</h1>
    <!-- anfang -->
    <div class="add-task-section">

        <div class="add-task-titel-container">
            <form action="">
                <p>Titel<span class="color-red">*</span></p>
                <input id="title" required class="margin-buttom" type="text" placeholder="Enter a title">
                <p>Description</p>
                <textarea id="description" class="margin-buttom" name="" id=""
                    placeholder="Enter a Description"></textarea>

                <p>Assigned to</p>
    <input onclick="toggleAssigned(event)" id="assignedSearch" type="search" onkeydown="filterContacts()" class="assigned-search"
                        placeholder="Select contacts to assign">
                    <div onclick="event.stopPropagation()" class="assigned-contacts-container d-none" id="assignedContainer"></div>
                    <div class="selected-contact d-none" id="selectedContact"></div>
        </div>

        <div class="add-task-between-line"></div>

        <div class="add-task-date-container">
            <p>Due date<span class="color-red">*</span></p>
            <input id="date" onclick="showDateToday()" required class="margin-buttom" type="date">
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
            <div class="custom-select-board" style="width:100%;">
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
            <button onclick="addNewTask(event)" class="btn">Create Task <img src="assets/img/add_task/check.svg"></button>
        </div>
    </div>
    </form>
    </div>
    `;
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
            <img onclick="closeDialogTask()" src="./assets/img/add_task/close.svg" alt="schließen">
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
               <div class="delete_task" onclick="deleteTask('${taskJson}', ${i})">
                <img src="./assets/img/delete.svg" alt="delete">
                <p>Delete</p>
            </div>
            <p>|</p>
            <div class="edit_task" onclick="editTask('${taskJson}', '${i}')">
                <img src="./assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </footer>
    </div>
    `;
}


/**
 * This function generates the HTML for the subtasks displayed the detailed view of a task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateSubtaskHtml(subtask, i) {
    return `
    <div class="edit-subtask-container" id="subtaskEditContainer${i}">
        <li onkeydown="checkSubtasksEditLength(${i})" id="subtaskTitle${i}" contenteditable="true" onblur="saveSubtaskTitle(${i})">${subtask.title}</li>
        <div class="subtask-edit-svg" id="subtaskSvg">
            <img onclick="editSubtask(${i})" src="./assets/img/edit.svg">
            <div class="subtask-edit-line"></div>
            <img onclick="deleteSubtask(${i})" src="./assets/img/add_task/delete.svg">
        </div>
    </div>
    `;
}


/**
 * This function generates the HTML for displaying the papup window for edit tasks.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateEditPopup(task, i) {
    return `
    <div>
        <div class="add-task-section-edit">
            <div class="add-task-titel-container-edit">
                <form action="">
                    <input type="hidden" id="taskId" value="${task.id}">
                    <p>Titel<span class="color-red">*</span></p>
                    <input id="title" required class="margin-buttom" type="text" placeholder="Enter a title" value="${task.title}">
                    <p>Description</p>
                    <textarea id="description" class="margin-buttom" placeholder="Enter a Description">${task.description}</textarea>
                    <p>Assigned to</p>
                    <input onclick="toggleAssigned(event)" id="assignedSearch" type="search" onkeydown="filterContacts()" class="assigned-search"
                        placeholder="Select contacts to assign">
                    <div onclick="event.stopPropagation()" class="assigned-contacts-container d-none" id="assignedContainer"></div>
                    <div class="selected-contact d-none" id="selectedContact"></div>
            </div>
            <div class="add-task-date-container-edit">
                <p>Due date<span class="color-red">*</span></p>
                <input id="date" onclick="showDateToday()" required class="margin-buttom" type="date" value="${task.date}">
                <p>Prio</p>
                <div class="margin-buttom add-task-prio">
                    <div class="prio-selection-urgent" onclick="taskUrgent()" id="urgent">
                        <span>Urgent</span>
                        <img id="imgUrgent" class="prio-icons" src="./assets/img/add_task/arrowsTop.svg">
                    </div>
                    <div class="prio-selection-medium medium" onclick="taskMedium()" id="medium">
                        <span>Medium</span>
                        <img id="imgMedium" class="prio-icons" src="./assets/img/add_task/result_white.svg">
                    </div>
                    <div class="prio-selection-low" onclick="taskLow()" id="low">
                        <span>Low</span>
                        <img id="imgLow" class="prio-icons" src="./assets/img/add_task/arrowsButtom.svg">
                    </div>
                </div>
                <p>Category<span class="color-red">*</span></p>
                <div class="custom-select-board" style="width:100%;">
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
                <button type="button" class="btn" onclick="saveEditedTask(${i})">OK<img src="assets/img/add_task/check.svg"></button>
            </div>
        </div>
        </form>
    </div>
    `;
}

/**
 * This function generates HTML content for displaying task contacts in the task details view.
 * 
 * @param {Object} task - This is the task object that containing contacts.
 * @param {number} i - This is the index of the task.
 */
function generateTaskContactsforDetails(task, i) {
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
}

/**
 * This function generates HTML content for displaying task subtasks in the task details view.
 * 
 * @param {Object} task - This is the task object that containing subtasks.
 * @param {number} i - This is the index of the task.
 */
function generateTaskSubtasksforDetails(task, i) {
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
}

/**
 * This function generates the HTML string for a subtask checkbox.
 * 
 * @function subtaskCheckboxHtml
 * @param {number} taskIndex - The index of the task containing the subtask.
 * @param {number} j - The index of the subtask within the task.
 * @param {Object} subtask - The subtask object containing its details.
 * @param {string} isChecked - The checked state of the checkbox ('checked' or '').
 * @returns {string} The HTML string for the subtask checkbox.
 */
function subtaskCheckboxHtml(taskIndex, j, subtask, isChecked) {
    return `
    <div id="single_subtask_${taskIndex}_${j}" class="single_subtask">
        <input onclick="updateProgressBar(${taskIndex}); saveCheckboxState(${taskIndex}, ${j})" class="subtask-checkbox" type="checkbox" ${isChecked}>
        <p>${subtask['title']}</p>
    </div>
    `;
}

/**
 * This ufnction generates HTML for a contact's initials.
 * 
 * @param {Object} contact - The contact object.
 * @param {string} contact.color - The background color for the initials.
 * @param {string} contact.initials - The initials of the contact.
 * @returns {string} HTML string of the contact initials.
 */
function generateAddTaskContactInitialsHTML(contact) {
    return `<div style="background-color: ${contact.color};" class="assigned-initials">${contact.initials}</div>`;
}

/**
 * This function generates the HTML for a task contact.
 * 
 * @param {string} contactName - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {boolean} isContactAdded - Whether the contact is already added to the task.
 * @returns {string} The HTML string for the contact.
 */
function generateBoardsContactHtml(contactName, initials, i, color, isContactAdded) {
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