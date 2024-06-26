(function () {
    const storedGuestTasks = localStorage.getItem('guestTasks');
    if (storedGuestTasks) {
        window.guestTasks = JSON.parse(storedGuestTasks);
    } else {
        window.guestTasks = [
            {
                'category': 'in-progress',
                'taskCategory': 'User Story',
                'title': 'Header',
                'description': 'Header Template erstellen',
                'date': '2024-06-26',
                'taskContacts': [
                    { initials: "EM", color: "#E64DAF", name: "Emmanuel Mauer" },
                    { initials: "MB", color: "#12B638", name: "Marcel Bauer" },
                    { initials: "AS", color: "#E0C880", name: "Anna Schmidt" }
                ],
                'prioImg': './assets/img/add_task/result.svg',
                'prio': 'Medium',
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
                    { initials: "LF", color: "#91CBAE", name: "Lukas Fischer" },
                    { initials: "AE", color: "#8DCBED", name: "Adrian Enßlin" },
                    { initials: "MW", color: "#35EED2", name: "Mia Wagner" },
                    { initials: "SM", color: "#9DDB29", name: "Stefan Meyer" },
                    { initials: "TM", color: "#A47096", name: "Tina Müller" }
                ],
                'prioImg': './assets/img/add_task/arrowsButtom.svg',
                'prio': 'Low',
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
                    { initials: "MB", color: "#5EC75C", name: "Marcel Bauer" },
                    { initials: "AS", color: "#E0DB18", name: "Anna Schmidt" }
                ],
                'prioImg': './assets/img/add_task/arrowsTop.svg',
                'prio': 'Urgent',
                'subtasks': [
                    { 'title': 'Analysieren', 'state': true },
                    { 'title': 'Designen', 'state': true }
                ]
            },
            {
                'category': 'await-feedback',
                'taskCategory': 'User Story',
                'title': 'Dark Mode hinzufügen',
                'description': 'Dark Mode für die Website implementieren',
                'date': '2024-06-29',
                'taskContacts': [
                    { initials: "MB", color: "#B15736", name: "Marcel Bauer" },
                    { initials: "AE", color: "#97AB21", name: "Adrian Enßlin" },
                    { initials: "EM", color: "#F73F8D", name: "Emmanuel Mauer" },
                    { initials: "AS", color: "#CC76C5", name: "Anna Schmidt" }
                ],
                'prioImg': './assets/img/add_task/arrowsButtom.svg',
                'prio': 'Low',
                'subtasks': [
                    { 'title': 'Konzept erstellen', 'state': true },
                    { 'title': 'Implementieren', 'state': true }
                ]
            },
            {
                'category': 'done',
                'taskCategory': 'User Story',
                'title': 'API-Dokumentation aktualisieren',
                'description': 'Neue Endpunkte zur API-Dokumentation hinzufügen',
                'date': '2024-06-25',
                'taskContacts': [
                    { initials: "AS", color: "#19148F", name: "Anna Schmidt" },
                    { initials: "SB", color: "#F757FE", name: "Sophie Becker" },
                    { initials: "MW", color: "#CB8C36", name: "Mia Wagner" }
                ],
                'prioImg': './assets/img/add_task/arrowsTop.svg',
                'prio': 'Urgent',
                'subtasks': [
                    { 'title': 'Schreiben', 'state': true },
                    { 'title': 'Überprüfen', 'state': true }
                ]
            }
        ];
    }
})();


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
 * Generates the HTML for displaying the detailed view of a guest user's task.
 * 
 * @param {Object} task - The task object containing the task details.
 * @param {number} i - The index of the task in the guest task list.
 */
function generateGuestTaskDetails(task, i) {
    const description = task['description'] ? task['description'] : 'No Description Available';

    return /*html*/`
    <div class="task-card-type-details">
        <div class="type-bg type-of-task">${task['taskCategory']}</div>
        <div class="close_and_change">
            <img onclick="closeDialogTask()" src="./assets/img/add_task/close.svg" alt="schließen">
        </div>
    </div>
    <div class="header_task_details">
        <h1>${task['title']}</h1>
        <p class="task-description">${description}</p>
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
        <img onclick="deleteSubtaskGuest(${i})" src="./assets/img/add_task/delete.svg">
      </div>
    </div>
    `;
}

