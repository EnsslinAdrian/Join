let registered = [];

function init() {
    includeHTML();
    loadData();
    initials();
}

const firebaseUrl = "https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadData(path = "") {
    const response = await fetch(firebaseUrl + ".json");
    const responseToJson = await response.json();
    console.log(responseToJson);
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
    let subtasks = document.getElementById('subtasks').value;

    let task = {
        'title': title,
        'description': description,
        'date': date,
        'category': categoryText,
        'subtasks': subtasks
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
}
