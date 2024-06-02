let registered = [];
let taskContacts = [];
let subtasks = [];
let prio = '';
let prioImg = '';
const firebaseUrl = "https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/"

function init() {
    includeHTML();
    loadData();
    initials();
    renderContacts();
    renderContactsAddTask();
    renderTaskBoard();
}

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
                localStorage.setItem('username', user.name)
                window.location.href = "summary.html";
                userFound = true;
                break;
            }
        }
    }

    if (!userFound) {
        document.getElementById('loginAnswer').innerHTML = 'Passwort falsch oder Benutzer nicht gefunden';
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
        document.getElementById('signAnswer').innerHTML = 'Passwörter stimmen nicht überein';
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
  <div id="showContact${i}" onclick="showContact('${contact.name}','${contact.email}', '${contact.phone}', '${initials}', '${contact.color}')" class="contact-card">
  <div style="background-color: ${contact['color']};" class="contact-icon">
      <span>${initials}</span>
  </div>
  <div class="contact">
      <span class="name">${contact['name']}</span>
      <a>${contact['email']}</a>
  </div>
</div>
  `;
}

function showContact(name, email, phone, initials, color) {
    let container = document.getElementById('show-contact-container');
    let contactContainer = document.getElementById('contact-container');
    let rightContent = document.querySelector('.right-content');
    let addIcon = document.getElementById('new-contact-icon');
    let editIcon = document.getElementById('edit-contact-icon');

    container.innerHTML = '';
    container.classList.add('active');
    contactContainer.classList.add('active');
    rightContent.classList.add('active');
    addIcon.classList.add('active');
    editIcon.classList.add('active');

    container.innerHTML = `
    <div class="show-contact slide-in">
    <div class="show-contact-header">
        <div style="background-color: ${color};" class="contact-icon-big">
            <span>${initials}</span>
        </div>
        <div class="name-and-edit">
            <div class="contact-name">
                ${name}
            </div>
            <div class="contact-settings">
                <div class="edit-contact" onclick="openEditPopup('${name}', '${email}', '${phone}', '${initials}', '${color}')">
                    <img src="assets/img/edit.svg">Edit 
                </div>
                <div class="del-contact">
                    <img src="assets/img/delete.svg">Delete
                </div>
        </div>
    </div>
        </div>
            <div class="show-contact-informations">
                <h2 class="h2">Contact Information</h2>
                <div class="email-and-phone">
                    <b>Email</b>
                    <a>${email}</a>
                </div>
                <div class="email-and-phone">
                    <b>Phone</b>
                    <a>${phone}</a>
                </div>
            </div>
    </div>
    `;
}

async function renderContactsAddTask() {
    if (window.location.pathname.endsWith("add_task.html")) {
        let response = await fetch(firebaseUrl + '.json');
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
    <div style="background-color: ${contact['color']};" class="assigned-initials">${initials}</div>
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

async function renderTaskBoard() {
    if (window.location.pathname.endsWith("board.html")) {
        let response = await fetch(`${firebaseUrl}.json`);
        let responseToJson = await response.json();

        let user = localStorage.getItem('userKey');
        let path = responseToJson['registered'][user];
        let tasks = path['tasks'];
        console.log(tasks)
        test = tasks;
    
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            let id = task['category']
            
            document.getElementById(id).innerHTML += generateTodoHTML(task, i);
            
        let conatctsContent = document.getElementById(`taskContacts${i}`)
        for (let j = 0; j < task['taskContacts'].length; j++) {
            let contacts = task['taskContacts'][j];

        conatctsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
        }
        }
    }
}

function clearShowContactContainer() {
    let contactContainer = document.getElementById('contact-container');
    let showContactContainer = document.getElementById('show-contact-container');
    let rightContent = document.querySelector('.right-content');
    let addIcon = document.getElementById('new-contact-icon');
    let editIcon = document.getElementById('edit-contact-icon');

    showContactContainer.innerHTML = '';
    showContactContainer.classList.remove('active');
    contactContainer.classList.remove('active');
    rightContent.classList.remove('active');
    addIcon.classList.remove('active');
    editIcon.classList.remove('active');
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
