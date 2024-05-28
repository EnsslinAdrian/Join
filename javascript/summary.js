let isRendering = false;

let originalSrc = './assets/img/summary/pen.svg';
let newSrc = './assets/img/summary/pen_white.svg';
let chopOriginalSrc = './assets/img/summary/chop.svg';
let chopWhiteSrc = './assets/img/summary/chop_white.svg';

let todosContainer = document.getElementById('todosContainer');
let penImage = document.getElementById('pen');
let doneContainer = document.getElementById('doneContainer');
let doneImage = document.getElementById('chop');

todosContainer.addEventListener('mouseenter', function () {
    penImage.src = newSrc;
});

todosContainer.addEventListener('mouseleave', function () {
    penImage.src = originalSrc;
});

doneContainer.addEventListener('mouseenter', function () {
    doneImage.src = chopWhiteSrc;
});

doneContainer.addEventListener('mouseleave', function () {
    doneImage.src = chopOriginalSrc;
});

function greetingUser() {
    let userName = localStorage.getItem('username');
    let name = document.getElementById('greetingUserName');
    name.innerHTML = userName;
}

greetingUser();

function renderResponsivSummary() {
    if (isRendering) return;
    isRendering = true;

    let headline = document.getElementById('summaryHeadline');
    let headlineResponsiv = document.getElementById('summaryHeadlineResponsiv');
    let taskDashboard = document.getElementById('summaryTaskDashboard');
    let greet = document.getElementById('greeting');

    if (window.innerWidth <= 1200) {
        headline.classList.add('d-none');
        headlineResponsiv.classList.add('d-none');
        taskDashboard.classList.add('d-none');
        greet.classList.add('d-none');

        setTimeout(() => {
            greet.classList.remove('d-none');
        }, 1000);

        setTimeout(() => {
            greet.classList.add('d-none');
            headlineResponsiv.classList.remove('d-none');
            taskDashboard.classList.remove('d-none');
            isRendering = false;
        }, 3000);

    } else {
        headline.classList.remove('d-none');
        headlineResponsiv.classList.add('d-none');
        taskDashboard.classList.remove('d-none');
        greet.classList.remove('d-none');
        isRendering = false;
    }
}

window.addEventListener('resize', renderResponsivSummary);

renderResponsivSummary();

async function renderSummaryTasks() {
    let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json')
    let responseToJson = await response.json();

    let user = localStorage.getItem('userKey');
    let pathUser = responseToJson['registered'][user];
    let tasks = pathUser['tasks'];

    console.log(tasks);
    document.getElementById('allTask').innerHTML = tasks.length;

    let categoryCounts = {
        'todo': 0,
        'in-progress': 0,
        'done': 0,
        'await-feedback': 0
    };

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let category = task['category'];
        if (categoryCounts.hasOwnProperty(category)) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    }

    document.getElementById('todoSummary').innerHTML = categoryCounts['todo'];
    document.getElementById('inProgressSummary').innerHTML = categoryCounts['in-progress'];
    document.getElementById('doneSummary').innerHTML = categoryCounts['done'];
    document.getElementById('awaitingSummary').innerHTML = categoryCounts['await-feedback'];
}

renderSummaryTasks();