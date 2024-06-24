let guestTasks = [
    {
        'category': 'in-progress',
        'taskCategory': 'User Story',
        'title': 'Header',
        'description': 'Header Template erstellen',
        'date': '2024-06-26',
        'taskContacts': [
            {
                'color': '#8128EE',
                'initials': 'AM',
                'name': 'Anton Mayer'
            },
            {
                'color': '#5E7CE2',
                'initials': 'LW',
                'name': 'Laura Weiß'
            },
            {
                'color': '#FF5733',
                'initials': 'JD',
                'name': 'Johann Dreher'
            }
        ],
        'prioImg': './assets/img/add_task/arrowsTop.svg',
        'prio': 'Urgent',
        'subtasks': [
            { 'title': 'Erstellen', 'state': false },
            { 'title': 'Stylen', 'state': false }
        ]
    },
    {
        'category': 'in-progress',
        'taskCategory': 'User Story',
        'title': 'Footer-Probleme',
        'description': 'Footer-Links funktionieren nicht',
        'date': '2024-06-27',
        'taskContacts': [
            {
                'color': '#FF5733',
                'initials': 'JS',
                'name': 'Julia Schmidt'
            },
            {
                'color': '#C70039',
                'initials': 'TH',
                'name': 'Thomas Hoffmann'
            },
            {
                'color': '#FFC300',
                'initials': 'MM',
                'name': 'Mia Müller'
            }
        ],
        'prioImg': './assets/img/add_task/arrowsTop.svg',
        'prio': 'Urgent',
        'subtasks': [
            { 'title': 'Identifizieren', 'state': false },
            { 'title': 'Beheben', 'state': false }
        ]
    },
    {
        'category': 'await-feedback',
        'taskCategory': 'User Story',
        'title': 'Navigation optimieren',
        'description': 'Navigationselemente verbessern',
        'date': '2024-06-28',
        'taskContacts': [
            {
                'color': '#28A745',
                'initials': 'SK',
                'name': 'Stefan König'
            },
            {
                'color': '#17A2B8',
                'initials': 'AB',
                'name': 'Anna Bauer'
            },
            {
                'color': '#FFC107',
                'initials': 'FR',
                'name': 'Felix Richter'
            }
        ],
        'prioImg': './assets/img/add_task/arrowsTop.svg',
        'prio': 'Urgent',
        'subtasks': [
            { 'title': 'Analysieren', 'state': false },
            { 'title': 'Designen', 'state': false }
        ]
    },
    {
        'category': 'await-feedback',
        'taskCategory': 'User Story',
        'title': 'Dark Mode hinzufügen',
        'description': 'Dark Mode für die Website implementieren',
        'date': '2024-06-29',
        'taskContacts': [
            {
                'color': '#343A40',
                'initials': 'RB',
                'name': 'Robert Braun'
            },
            {
                'color': '#007BFF',
                'initials': 'CK',
                'name': 'Clara Klein'
            },
            {
                'color': '#6C757D',
                'initials': 'PH',
                'name': 'Paul Hartmann'
            }
        ],
        'prioImg': './assets/img/add_task/arrowsTop.svg',
        'prio': 'Urgent',
        'subtasks': [
            { 'title': 'Konzept erstellen', 'state': false },
            { 'title': 'Implementieren', 'state': false }
        ]
    },
    {
        'category': 'done',
        'taskCategory': 'User Story',
        'title': 'API-Dokumentation aktualisieren',
        'description': 'Neue Endpunkte zur API-Dokumentation hinzufügen',
        'date': '2024-06-25',
        'taskContacts': [
            {
                'color': '#6610F2',
                'initials': 'LB',
                'name': 'Lena Becker'
            },
            {
                'color': '#E83E8C',
                'initials': 'TS',
                'name': 'Timo Schulz'
            },
            {
                'color': '#28A745',
                'initials': 'JK',
                'name': 'Julia Krause'
            }
        ],
        'prioImg': './assets/img/add_task/arrowsTop.svg',
        'prio': 'Urgent',
        'subtasks': [
            { 'title': 'Schreiben', 'state': true },
            { 'title': 'Überprüfen', 'state': true }
        ]
    }
];


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
 * Generates the HTML for a guest user's task card on the board page.
 * 
 * @param {Object} element - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 * @returns {string} The HTML string for the task card.
 */
function generateGuestTodoHTML(element, i) {
    const description = element['description'] ? element['description'] : '';
    const prioImg = element['prioImg'] ? `<img src="${element['prioImg']}">` : '';
    const taskCategory = element['taskCategory'] ? element['taskCategory'] : 'Keine Kategorie vorhanden';
    const hasSubtasks = element['subtasks'] && element['subtasks'].length > 0;

    return /*html*/`
    <div id="task${i}" draggable="true" ondragstart="startDragging(${i})" class="todo task-item" data-index="${i}">
        <div class="task-card" onclick="openDialogGuestTask(${i})">
            <div class="task-card-type">
                <div class="type-bg" style="background-color: blue;">${taskCategory}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description shorter_description">${description}</p>
            ${hasSubtasks ? `
            <div class="progress" id="progress">
                <div class="progress-bar">
                    <div class="progress-bar-content" id="progress-bar-content-${i}"></div>
                </div>
                <span onload="updateProgressBar(${i})" id="completed-subtasks-${i}">Subtasks</span>
            </div>
            ` : ''}
            <div class="task-card-bottom">
                <div class="taskContacts" id="taskContacts${i}">
                </div>
                ${prioImg}
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
        let isChecked = subtask['state'] ? 'checked' : '';

        subtasks.innerHTML += `
        <div id="single_subtask_${i}_${k}" class="single_subtask">
            <input onclick="updateProgressBar(${i}); saveGuestCheckboxState(${i}, ${k})" class="subtask-checkbox" type="checkbox" ${isChecked}>
            <p>${subtask['title']}</p>
        </div>
        `;
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
            <div class="delete_task" onclick="deleteGuestTask(${i})">
                <img src="./assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <p>|</p>
            <div class="edit_task" onclick="editTaskGuest(${i})">
                <img src="./assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
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
 * This function generates the HTML for displaying the popup window for edit tasks.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the task list.
 */
function generateEditPopupGuest(task, i) {
    // Aktualisieren Sie die globale `taskContacts`-Variable
    taskContacts = task.taskContacts || [];
    subtasks = task.subtasks || [];

    return `
    <div>
        <div class="add-task-section-edit">
            <div class="add-task-titel-container-edit">
                <div class="close_edit_popup">
                    <img onclick="closeDialogTask()" src="./assets/img/add_task/close.svg" alt="schließen">
                </div>
                <form id="editTaskForm" onsubmit="saveEditedTask(event, ${i})">
                    <input type="hidden" id="taskId" value="${task.id}">
                    <p>Titel<span class="color-red">*</span></p>
                    <input id="title" required class="margin-buttom" type="text" placeholder="Enter a title" value="${task.title}">
                    <p>Description</p>
                    <textarea id="description" class="margin-buttom" placeholder="Enter a Description">${task.description}</textarea>
                    <p>Assigned to</p>
                     <input onclick="openAssignedGuest(event, ${i})" id="assignedSearch" type="search"
                                onkeydown="filterContacts()" class="assigned-search"
                                placeholder="Select contacts to assign">
                            <div onclick="event.stopPropagation()" class="assigned-contacts-container d-none" id="assignedContainer">

                            </div>
                            <div class="selected-contact d-none" id="selectedContact"></div>
            </div>
            <div class="add-task-date-container-edit">
                <p>Due date<span class="color-red">*</span></p>
                <input id="date" onclick="showDateToday()" required class="margin-buttom" type="date" value="${task.date}">
                <p>Prio</p>
                <div class="margin-buttom add-task-prio">
                    <div class="prio-selection-urgent ${task.priority === 'urgent' ? 'urgent' : ''}" onclick="taskUrgent()" id="urgent">
                        <span>Urgent</span>
                        <img id="imgUrgent" class="prio-icons" src="${task.priority === 'urgent' ? './assets/img/add_task/arrow_white.svg' : './assets/img/add_task/arrowsTop.svg'}">
                    </div>
                    <div class="prio-selection-medium medium ${task.priority === 'medium' ? 'medium' : ''}" onclick="taskMedium()" id="medium">
                        <span>Medium</span>
                        <img id="imgMedium" class="prio-icons" src="${task.priority === 'medium' ? './assets/img/add_task/result_white.svg' : './assets/img/add_task/result.svg'}">
                    </div>
                    <div class="prio-selection-low ${task.priority === 'low' ? 'low' : ''}" onclick="taskLow()" id="low">
                        <span>Low</span>
                        <img id="imgLow" class="prio-icons" src="${task.priority === 'low' ? './assets/img/add_task/arrow_buttom_white.svg' : './assets/img/add_task/arrowsButtom.svg'}">
                    </div>
                </div>
                <p>Category<span class="color-red">*</span></p>
                <div class="custom-select-board" style="width:100%;">
                    <select id="select">
                        <option value="0">Select task category</option>
                        <option value="1" ${task.taskCategory === 'Technical Task' ? 'selected' : ''}>Technical Task</option>
                        <option value="2" ${task.taskCategory === 'User Story' ? 'selected' : ''}>User Story</option>
                    </select>
                </div>
                <p>Subtasks</p>
                <div class="subtasks-container">
                    <input id="subtask" placeholder="Add new subtask" onkeypress="return event.keyCode!=13">
                    <div class="subtasks-button">
                        <button onclick="addNewSubtasksGuest(${i})" type="button">+</button>
                    </div>
                </div>
            <div class="subtasks-list">
                            <ul id="subtasksList${i}"></ul>
                        </div>
            </div>
        </div>
        <div class="send-add-task-buttons">
            <div class="buttons">
                <button type="button" class="btn" onclick="saveEditedTaskGuest(${i})">OK<img src="assets/img/add_task/check.svg"></button>
            </div>
        </div>
        </form>
    </div>
    `;
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
 * This function generates the HTML for a subtask.
 * 
 * @param {Object} subtask - This is the subtask object.
 * @param {number} i - This is the index of the subtask.
 * @returns {string} This generates HTML string for the subtask.
 */
function generateSubtaskGuestHtml(contact, i) {
    return `
    <div class="edit-subtask-container" id="subtaskEditContainer${i}">
      <li onkeydown="checkSubtasksEditLength(${i})" id="subtaskTitle${i}" contenteditable="false" onblur="saveSubtaskTitle(${i})">${contact.title}</li>
      <div class="subtask-edit-svg" id="subtaskSvg">
        <img onclick="editSubtask(${i})" src="./assets/img/edit.svg">
        <div class="subtask-edit-line"></div>
        <img onclick="deleteSubtask(${i})" src="./assets/img/add_task/delete.svg">
      </div>
    </div>
    `;
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

    console.log(taskCategory.options[taskCategory.selectedIndex].text);
    console.log(title.value);
    console.log(description.value);
    console.log(date.value);
    console.log(prio);
    console.log(prioImg);
    console.log(subtasks);
    console.log(taskContacts);

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
        taskContacts: [...taskContacts] // Use the updated contacts
    };

    // Save the updated guestTasks list in localStorage
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
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      content.innerHTML += generateSubtaskGuestHtml(subtask, i);
    }
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


/**
 * This function adds or removes a contact from the task for a guest user.
 * 
 * @param {string} contactName - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact in the contact list.
 * @param {string} color - The background color for the contact's initials.
 */
function addContactTaskForGuest(contactName, initials, i, color) {
    let newTaskContact = {
        'initials': initials,
        'color': color,
        'name': contactName
    };

    let checkbox = document.getElementById(`taskCheckbox${i}`);

    if (checkbox.checked) {
        if (!taskContacts.some(contact => contact.name === contactName)) {
            taskContacts.push(newTaskContact);
        }
    } else {
        let contactIndex = taskContacts.findIndex(contact => contact.name === contactName);
        if (contactIndex !== -1) {
            taskContacts.splice(contactIndex, 1);
        }
    }

    renderAddTaskContactInitialsGuest(i);
}

/**
 * This function renders the initials for the contacts in the "Assigned to" section.
 */
function renderAddTaskContactInitialsGuest(i) {
    let content = document.getElementById(`selectedContact`);
    if (!content) {
        console.error(`Element with id selectedContact${i} not found.`);
        return;
    }

    content.innerHTML = '';

    if (taskContacts && Array.isArray(taskContacts) && taskContacts.length > 0) {
        for (let j = 0; j < taskContacts.length; j++) {
            let contact = taskContacts[j];
            content.innerHTML += generateAddTaskContactInitialsHTML(contact);
        }
    } else {
        content.innerHTML = '<p>No contacts assigned</p>';
    }
}
