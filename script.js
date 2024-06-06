let registered = [];
let taskContacts = [];
let subtasks = [];
let prio = 'Medium';
let prioImg = './assets/img/add_task/result.svg';
const firebaseUrl = "https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/"

/**
 * This is the onload function to render and start all functions when the page reloads
 */
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

/**
 * This function checks if the user's login data is correct
 * 
 * @param {string} event - prevents the page from reloading when the submit action is triggered
 */
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

/**
 * This function takes the stored username, splits the words, and retrieves the first letter of each word to form the initials
 */
function initials() {
    let userName = localStorage.getItem('username');
    let initials = userName.split(' ').map(word => word[0]).join('');
    document.getElementById('initials').innerHTML = initials;
}

/**
 * Sends a POST request to the specified Firebase path with the provided data.
 * 
 * @param {string} path - The path to append to the Firebase URL.
 * @param {Object} data - The data to be sent in the POST request.
 * @returns {Promise<Object>} The JSON response from the Firebase server.
 */
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

/**
 * Handles the user registration process by preventing the default form submission,
 * validating the input fields, and sending a POST request to store the user data.
 * 
 * @param {Event} event - The event object representing the form submission event.
 * @returns {void}
 */
function registration(event) {
    event.preventDefault();

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('loginPassword');
    let confirmPassword = document.getElementById('confirmLoginPassword');

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

/**
 * Handles the addition of a new task by preventing the default form submission,
 * collecting task details, and storing the task either in Firebase for registered users
 * or in localStorage for guest users.
 * 
 * @param {Event} event - The event object representing the form submission event.
 */
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

    if (localStorage.getItem('username') !== 'Guest') {
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
        window.location.href = 'board.html';
    } else {
        let guestTasks = localStorage.getItem('guestTasks') ? JSON.parse(localStorage.getItem('guestTasks')) : [];

        guestTasks.push(task);

        localStorage.setItem('guestTasks', JSON.stringify(guestTasks));

        window.location.href = 'board.html';
    }
}

/**
 * Generates a random background color for the initials of each contact.
 * 
 * @returns {string} A randomly generated hex color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Fetches and renders contacts from the specified path in the Firebase database.
 * If the current page is contacts.html, it updates the contact container with
 * the fetched contact data.
 * 
 * @param {string} path - The path to append to the Firebase URL for fetching contacts.
 * @returns {Promise<void>}
 */
async function renderContacts(path = "") {
    if (window.location.pathname.endsWith("contacts.html")) {
        let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('contactContainer');
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);
        content.innerHTML = "";

        for (let key in contacts) {
            let contact = contacts[key];
            contact.id = key;
            let initialsBgColor = getRandomColor();

            content.innerHTML += generateContactHtml(contact, key, contactsArray.indexOf(contact));
        }
    }

}

/**
 * Generates the HTML for a contact card.
 * 
 * @param {Object} contact - The contact object containing the contact details.
 * @param {number} index - The index of the contact in the contact list.
 * @returns {string} The generated HTML string for the contact card.
 */
function generateContactHtml(contact, id, index) {
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');
    let contactStr = encodeURIComponent(JSON.stringify(contact));

    return `
  <div id="showContact${id}" onclick="showContact('${contactStr}', '${id}', '${index}'); changeBgColor('showContact${id}')" class="contact-card">
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

function showContact(contactStr, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactStr));
    let contactName = contact['name'];
    let contactJson = encodeURIComponent(JSON.stringify(contact));
    let initials = contactName.split(' ').map(word => word[0]).join('');
    let container = document.getElementById('show-contact-container');
    let contactContainer = document.getElementById('contact-container');
    let rightContent = document.querySelector('.right-content');
    let addIcon = document.getElementById('new-contact-icon');

    container.innerHTML = '';
    container.classList.add('active');
    contactContainer.classList.add('active');
    rightContent.classList.add('active');
    addIcon.classList.add('active');

    container.innerHTML = `
    <div class="show-contact slide-in">
    <div class="show-contact-header">
        <div style="background-color: ${contact['color']};" class="contact-icon-big">
            <span class="icon-initials">${initials}</span>
        </div>
        <div class="name-and-edit">
            <div class="contact-name">
                ${contact['name']}
            </div>
            <div class="contact-settings">
                <div class="edit-contact" onclick="openEditPopup('${contactJson}', '${id}', '${index}')">
                    <img src="assets/img/edit.svg">Edit 
                </div>
                <div class="del-contact" onclick="deleteContact('${contactJson}', '${id}', '${index}')">
                    <img src="assets/img/delete.svg">Delete
                </div>
        </div>
    </div>
        </div> 
            <div class="show-contact-informations">
                <h2 class="h2">Contact Information</h2>
                <div class="email-and-phone">
                    <b>Email</b>
                    <a>${contact['email']}</a>
                </div>
                <div class="email-and-phone">
                    <b>Phone</b>
                    <a>${contact['phone']}</a>
                </div>
            </div>
            <div id="edit-contact-icon" class="edit-contact-icon d-none" onclick="openEditPopup('${contactJson}', '${id}', '${index}')">
                <img src="assets/img/contacts/more_vert.svg">
            </div>
    </div>
    `;
    let editIcon = document.getElementById('edit-contact-icon');
    editIcon.classList.add('active');
}

async function deleteContact(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));

    let response = await fetch(`${firebaseUrl}/contacts/${id}.json`, {

        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        document.getElementById(`showContact${id}`).remove();
        clearShowContactDetails();
        document.getElementById('edit-contact-popup').classList.add('d-none');
    } else {
        console.error('Fehler beim Löschen des Kontakts:', response.statusText);
    }
}

function clearShowContactDetails() {
    let showContactContainer = document.getElementById('show-contact-container');
    showContactContainer.innerHTML = '';
    showContactContainer.classList.remove('active');
}

/**
 * Renders the contacts on the addTask page for the "Assigned to" section. 
 */
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

/**
 * Generates the HTML for a contact card to be displayed on the task assignment section.
 * 
 * @param {Object} contact - The contact object containing the contact details.
 * @param {number} i - The index of the contact in the contact list.
 * @param {string} color - The background color for the contact's initials.
 * @returns {string} The generated HTML string for the contact card in the task assignment section.
 */
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

function changeBgColor(contact) {
    let contacts = document.querySelectorAll('.contact-card');
    contacts.forEach(contact => {
        contact.style.backgroundColor = '';
        contact.style.color = '';
    });

    let clickedContact = document.getElementById(contact);
    if (clickedContact) {
        clickedContact.style.backgroundColor = '#2B3647'; 
        clickedContact.style.color = 'white';
    }
}

/**
 * This function creates a new contact and stores it in the database.
 * 
 * @param {string} contactName - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact in the contact list.
 * @param {string} color - The background color for the contact's initials.
 */
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

/**
 * This function renders the created and stored tasks from the database 
 * for registered users or from localStorage for guest users.
 */
async function renderTaskBoard() {
    if (window.location.pathname.endsWith("board.html")) {
        if (localStorage.getItem('username') !== 'Guest') {
            let response = await fetch(`${firebaseUrl}.json`);
            let responseToJson = await response.json();

            let user = localStorage.getItem('userKey');
            let path = responseToJson['registered'][user];
            let tasks = path['tasks'];
            console.log(tasks);
            test = tasks;

            document.getElementById('todo').innerHTML = '';
            document.getElementById('in-progress').innerHTML = '';
            document.getElementById('await-feedback').innerHTML = '';
            document.getElementById('done').innerHTML = '';

            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                let id = task['category'];

                document.getElementById(id).innerHTML += generateTodoHTML(task, i);

                let contactsContent = document.getElementById(`taskContacts${i}`);
                for (let j = 0; j < task['taskContacts'].length; j++) {
                    let contacts = task['taskContacts'][j];

                    contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
                }
            }
        } else {
            renderGuestTaskBoard();
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

    await postUser('contacts', contact);
    renderContacts();
    showNotification();
    showContact(JSON.stringify(contact), '', '');
    closeAddNewContact();
}

function showNotification() {
    let notification = document.getElementById('notification');
    notification.classList.add('slide-in')
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function closeAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function() { 
        addClassDnone(container);
    }, { once: true });
}

function openProfilPopup() {
    const popup = document.getElementById('popupLogout');
    popup.classList.toggle('d-none');
    popup.classList.toggle('popup-logout-mobile');
}

function logOut() {
    const keysToRemove = ['userKey', 'username'];

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    window.location.href = 'index.html';
}

/**
 * This function sets a keyword with the name 'Guest' in localStorage when logging in as a guest user,
 * and then redirects to summary.html.
 */
function questLogin() {
  localStorage.setItem('username', 'Guest');
  window.location.href = 'summary.html';
}