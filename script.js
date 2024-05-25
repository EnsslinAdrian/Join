let registered = [];
let taskContacts = [];
let subtasks = [];
let prio = '';
let prioImg = '';
let tasks = [];

function init() {
    includeHTML();
    loadData();
    initials();
    renderContacts();
    renderContactsAddTask();
    renderTaskBoard();
}

const firebaseUrl = "https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadData(path = "") {
    const response = await fetch(firebaseUrl + ".json");
    const responseToJson = await response.json();
}

async function checkUser(event) {
    event.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    const response = await fetch(firebaseUrl + ".json");
    const responseToJson = await response.json();

    let registered = responseToJson.registered;
    let userFound = false;

    for (let key in registered) {
        if (registered.hasOwnProperty(key)) {
            let user = registered[key];
            localStorage.setItem('userKey', key);

            if (user.email === email && user.password === password) {
                console.log('Passwort richtig');
                console.log('Hallo ' + user.name);
                localStorage.setItem('username', user.name)
                window.location.href = "summary.html";
                userFound = true;
                break;
            }
        }
    }

    if (!userFound) {
        console.log('Passwort falsch oder Benutzer nicht gefunden');
    }
}

function initials() {
    let userName = localStorage.getItem('username');
    let initials = userName.split(' ').map(word => word[0]).join('');
    document.getElementById('initials').innerHTML = initials;
}

async function postUser(path = "", data = {}) {
    let response = await fetch(firebaseUrl + path + ".json", {

        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

function registration(event) {
    event.preventDefault();

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    if (password.value !== confirmPassword.value) {
        alert("Passwörter stimmen nicht überein");
        return;
    }

    let user = {
        'name': name.value,
        'email': email.value,
        'password': password.value
    };

    postUser("registered", user)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error('Fehler beim Speichern des Benutzers:', error);
        });

    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
}

async function addNewTask(event) {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('date').value;
    let categoryElement = document.getElementById('select');
    let categoryText = categoryElement.selectedOptions[0].text;

    let task = {
        'category': 'todo',
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'prioImg': prioImg,
        'taskCategory': categoryText,
        'subtasks': subtasks,
        'taskContacts': taskContacts
    };

    let userKey = localStorage.getItem('userKey');

    const response = await fetch(`${firebaseUrl}/registered/${userKey}.json`);
    const user = await response.json();

    if (!user.tasks) {
        user.tasks = [];
    }

    user.tasks.push(task);

    await fetch(`${firebaseUrl}/registered/${userKey}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    clearTask();
}

async function newContact() {
    let name = document.getElementById('contactName');
    let email = document.getElementById('contactEmail');
    let phone = document.getElementById('contactPhone');
    let initialsBgColor = getRandomColor();

    let contact = {
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'color': initialsBgColor
    }

    postUser('contacts', contact);
};


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function renderContacts(path = "") {
    if (window.location.pathname.endsWith("contacts.html")) {
        let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('contactContainer');
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);
        content.innerHTML = "";

        for (let i = 0; i < contactsArray.length; i++) {
            let contact = contactsArray[i];
            let initialsBgColor = getRandomColor();

            content.innerHTML += generateContactHtml(contact, i, initialsBgColor);
        }
    }
}

function generateContactHtml(contact, i, color) {
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');

    return `
  <div class="contact-card">
  <div style="background-color: ${color};" class="contact-icon">
      <span>${initials}</span>
  </div>
  <div class="contact">
      <span class="name">${contact['name']}</span>
      <a>${contact['email']}</a>
  </div>
</div>
  `;
}

async function renderContactsAddTask() {
    if (window.location.pathname.endsWith("add_task.html")) {
        let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('assignedContainer');
        content.innerHTML = '';
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);

        for (let i = 0; i < contactsArray.length; i++) {
            let contact = contactsArray[i];
            let initialsBgColor = getRandomColor();

            content.innerHTML += generateTaskContactHtml(contact, i, initialsBgColor);
        }
    }
}

function generateTaskContactHtml(contact, i, color) {
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');
    return `
    <div class="assigned-contact" id="contactTask${i}">
    <div class="contact-name">
    <div style="background-color: ${color};" class="assigned-initials">${initials}</div>
    <p>${contact['name']}</p>
    </div>
    <input id="taskCheckbox${i}" onclick="addContactTask('${contactName}' ,'${initials}', ${i}, '${color}')" class="checkbox" type="checkbox">
    </div>
    `;
}

function addContactTask(contactName, initials, i, color) {
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
        let index = taskContacts.findIndex(contact => contact.name === contactName);
        if (index !== -1) {
            taskContacts.splice(index, 1);
        }
    }
    renderAddTaskContactInitials();
}

function renderAddTaskContactInitials() {
    let content = document.getElementById('selectedContact');
    content.innerHTML = "";
    for (let i = 0; i < taskContacts.length; i++) {
        let contact = taskContacts[i];
        content.innerHTML += ` <div style="background-color: ${contact['color']};" class="assigned-initials">${contact['initials']}</div>`;
    }
}

function taskUrgent() {
    prio = 'Urgent';
    prioImg = './assets/img/add_task/arrowsTop.svg';
    document.getElementById('urgent').classList.add('urgent')
    document.getElementById('medium').classList.remove('medium')
    document.getElementById('low').classList.remove('low')
    document.getElementById('imgUrgent').src = './assets/img/add_task/arrow_white.svg';
    document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
    document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
}

function taskMedium() {
    prio = 'Medium';
    prioImg = './assets/img/add_task/result.svg';
    document.getElementById('medium').classList.add('medium')
    document.getElementById('urgent').classList.remove('urgent')
    document.getElementById('low').classList.remove('low')
    document.getElementById('imgMedium').src = './assets/img/add_task/result_white.svg';
    document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
    document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
}

function taskLow() {
    prio = 'Low';
    prioImg = './assets/img/add_task/arrowsButtom.svg';
    document.getElementById('low').classList.add('low')
    document.getElementById('urgent').classList.remove('urgent')
    document.getElementById('medium').classList.remove('medium')
    document.getElementById('imgLow').src = './assets/img/add_task/arrow_buttom_white.svg';
    document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
    document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
}



function addNewSubtasks() {
    let subtask = document.getElementById('subtask');
    if (subtasks.length < 2) {
        if (subtask.value.length >= 1) {
            subtasks.push(subtask.value);
            subtask.value = '';
            renderSubtasksList();
        }
    }
}

function renderSubtasksList() {
    let content = document.getElementById('subtasksList');
    content.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        content.innerHTML += `<li>${subtask}</li>`;
    }
}

function clearTask() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    taskContacts = [];
    document.getElementById('date').value = '';
    prio = '';
    document.getElementById('urgent').classList.remove('urgent')
    document.getElementById('medium').classList.remove('medium')
    document.getElementById('low').classList.remove('low')
    document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
    document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
    document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
    subtasks = [];
    renderAddTaskContactInitials();
    renderSubtasksList();
}


async function filterContacts(path = '') {
    let response = await fetch(`${firebaseUrl}.json`);
    let responseToJson = await response.json();

    let contacts = responseToJson.contacts;
    let contactsArray = Object.values(contacts);

    let search = document.getElementById('assignedSearch').value.toLowerCase();

    let content = document.getElementById('assignedContainer');
    content.innerHTML = '';

    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
        let contactName = contact.name.toLowerCase();

        if (contactName.includes(search)) {
            let initials = contact.name.split(' ').map(word => word[0]).join('');
            let initialsBgColor = getRandomColor();
            if (search.length == 0) {
                renderContactsAddTask();
            } else {

                content.innerHTML += generateContactsSearchHtml(contact, initials, initialsBgColor, i);
            }
        }
    }
}

function generateContactsSearchHtml(contact, initials, initialsBgColor, i) {
    return `
    <div class="assigned-contact" id="contactTask${i}">
                <div class="contact-name">
                    <div style="background-color: ${initialsBgColor};" class="assigned-initials">${initials}</div>
                    <p>${contact.name}</p>
                </div>
                <input id="taskCheckbox${i}" onclick="addContactTask('${contact.name}', '${initials}', ${i}, '${initialsBgColor}')" class="checkbox" type="checkbox">
            </div>
    `;
}

async function renderTaskBoard() {
    if (window.location.pathname.endsWith("board.html")) {
        let response = await fetch(`${firebaseUrl}.json`);
        let responseToJson = await response.json();

        let content = document.getElementById('todo');
        let detailsContent = document.getElementById('taskDetails');

        let user = localStorage.getItem('userKey');
        let path = responseToJson['registered'][user];
        let tasks = path['tasks'];
        console.log(tasks)

        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];

            content.innerHTML += generateTodoHTML(task, i);
            detailsContent.innerHTML = showDetails(task);

            let conatctsContent = document.getElementById(`taskContacts${i}`)
            for (let j = 0; j < task['taskContacts'].length; j++) {
                let contacts = task['taskContacts'][j];

                conatctsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
            }
        }
    }
}

function generateTodoHTML(element, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo" onclick="openDialogTask(${i})">
        <div class="task-card">
            <div class="task-card-type">
                <div class="type-bg" style="background-color: ${element['taskcolor']};">${element['taskCategory']}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description">${element['description']}</p>
            <div class="progress">
                <div class="progress-bar"></div>
                    ${element['subtasks']} Subtasks
            </div>
            <div class="task-card-bottom">
                <div class="taskContacts" id="taskContacts${i}">
            
                </div>
                <img src="assets/img/Vector.svg">
            </div>
        </div>
    </div>
    `;
}


function openDialogTask(i) {
    let task = tasks[i];
    console.log("dialog Fenster öffnet sich.")
    document.getElementById('dialog').classList.remove('d_none');
    let taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML = showDetails(task);
}


function showDetails(task) {
    return /*html*/`
    <div id="taskDetails">
        <div class="task-card-type">
             <div class="type-bg">${task['taskCategory']}</div> <!-- style="background-color: ${task['taskcolor']};"-->
        </div>
        <div class="header_task_details">
            <h1>${task['title']}</h1>
            <p class="task-description">${task['description']}</p>
        </div>
        <div class="task_details_information">
            <div>
                <p>Due date:</p><p>${task['date']}</p>
            </div>
            <div>
                <p>Priority</p><img src="${task['prioImg']}" alt="">
            </div>
            <div>
                <p>Assigned To:</p><p>${task['taskContacts']}</p>
            </div>
            <div>
                <p>Subtasks</p>
                <p>${task['subtasks']}</p>
            </div>
            <footer class="details_delete_edit">
                <img src="../assets/img/delete.svg" alt="">
                <p>Delete</p>|
                <img src="../assets/img/edit.svg" alt="">
                <p>Edit</p>
            </footer>
        </div>
    </div>
    `;
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
