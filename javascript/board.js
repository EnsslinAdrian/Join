let todos = [{
    'id': 0,
    'title': 'User Story',
    'description': 'Create a contact form and imprint page...',
    'subtasks': 2,
    'category': 'in-progress'
}]


let currentDraggedTask;


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
    popup.addEventListener('transitionend', function() { // sobald die animation fertig ist, wird der task geschlossen
        closeAddTask();
    }, { once: true });
}



function updateHTML() {
    upadeteTodo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
}


function upadeteTodo() {
    let todo = todos.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let i = 0; i < todo.length; i++) {
        const todoElement = todo[i];
        document.getElementById('todo').innerHTML += generateTodoHTML(todoElement);
    }
}


function updateInProgress() {
    let inProgress = todos.filter(t => t['category'] == 'in-progress');

    document.getElementById('in-progress').innerHTML = '';

    for (let i = 0; i < inProgress.length; i++) {
        const inProgressElement = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTodoHTML(inProgressElement);
    }
}


function updateAwaitFeedback() {
    let awaitFeedback = todos.filter(t => t['category'] == 'await-feedback');

    document.getElementById('await-feedback').innerHTML = '';

    for (let i = 0; i < awaitFeedback.length; i++) {
        const awaitFeedbackElement = awaitFeedback[i];
        document.getElementById('await-feedback').innerHTML += generateTodoHTML(awaitFeedbackElement);
    }
}


function updateDone() {
    let done = todos.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let i = 0; i < done.length; i++) {
        const doneElement = done[i];
        document.getElementById('done').innerHTML += generateTodoHTML(doneElement);
    }
}


function startDragging(id) {
    currentDraggedTask = id;
}


function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    todos[currentDraggedTask]['category'] = category;
    updateHTML();
}


function highlight(id) {
    document.getElementById(id).classList.add('drag_area_hightlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag_area_hightlight');
}