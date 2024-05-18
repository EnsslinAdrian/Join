let registered = [];

function init() {
    includeHTML();
    loadData();
}

const firebaseUrl = "https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadData(path = "") {
    const response = await fetch(firebaseUrl + ".json");
    const responseToJson = await response.json();
    console.log(responseToJson);
}

async function postUser(path = "", data = {}) {
    let response = await fetch(firebaseUrl + path + ".json", {

        method: "Post",
        headers: {
            "Content-Type": "application/jason",
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}

loadData();

function registration(event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwörter stimmen nicht überein");
        return;
    }

    let user = {
        'name': name,
        'email': email,
        'password': password
    };

    registered.push(user);
    savelocal();
}

function savelocal() {
    let saveJsonAsText = JSON.stringify(registered);
    localStorage.setItem('register', saveJsonAsText);
}

function loadlocal() {
    let saveJsonAsText = localStorage.getItem('register');
    if (saveJsonAsText) {
        registered = JSON.parse(saveJsonAsText);
    }
}