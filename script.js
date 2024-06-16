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
    renderGuestTaskBoard();
    updateAllGuestsProgressBars();
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
            test = tasks;

            document.getElementById('todo').innerHTML = '';
            document.getElementById('in-progress').innerHTML = '';
            document.getElementById('await-feedback').innerHTML = '';
            document.getElementById('done').innerHTML = '';

            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                let id = task['category'];

                document.getElementById(id).innerHTML += generateTodoHTML(task, i);
                updateProgressBar(i);

                let contactsContent = document.getElementById(`taskContacts${i}`);
                for (let j = 0; j < task['taskContacts'].length; j++) {
                    let contacts = task['taskContacts'][j];

                    contactsContent.innerHTML += `<p class="user-icon" style="background-color: ${contacts['color']};">${contacts['initials']}</p>`;
                } 
            }
            await updateAllProgressBars();
            
        } else {
            renderGuestTaskBoard();
        }
    }
}

async function newContact() {
    let name = document.getElementById('contact-Name');
    let email = document.getElementById('contact-Email');
    let phone = document.getElementById('contact-Phone');
    let initialsBgColor = getRandomColor();
    
    let contact = {
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'color': initialsBgColor
    }
    let newContactResponse = await postUser('contacts', contact);
    let newContactId = newContactResponse.name;
    let newContactIndex = Array.from(document.querySelectorAll('.contact-card')).findIndex(contact => contact.id === `showContact${newContactId}`);

    await renderContacts();
    showContact(JSON.stringify(contact), newContactId, newContactIndex); 
    showNotification();
    changeBgColor(`showContact${newContactId}`);
    closeAddNewContact(); 
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