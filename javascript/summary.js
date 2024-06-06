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

/**
 * Greets the user by displaying their username stored in localStorage.
 * Retrieves the username and updates the HTML content of the specified element.
 */
function greetingUser() {
    let userName = localStorage.getItem('username');
    let name = document.getElementById('greetingUserName');
    name.innerHTML = userName;

 let currentHour = new Date().getHours();
    let greetingMessage;

    if (currentHour < 12) {
        greetingMessage = "Good morning";
    } else if (currentHour < 18) {
        greetingMessage = "Good afternoon";
    } else {
        greetingMessage = "Good evening";
    }

    document.getElementById('greetingTime').innerHTML = greetingMessage;
}

greetingUser();

/**
 * Renders a responsive summary view based on the window width.
 * If the window width is less than or equal to 1200 pixels, it shows
 * a greeting and hides other elements temporarily.
 */
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

/**
 * Renders the summary of tasks for the logged-in user by fetching task data from the Firebase database.
 * Updates the task counts and the nearest upcoming task information on the summary page.
 */
async function renderSummaryTasks() {
    if (localStorage.getItem('username') !== 'Guest') {
        let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json');
        let responseToJson = await response.json();

        let user = localStorage.getItem('userKey');
        let pathUser = responseToJson['registered'][user];
        let tasks = pathUser['tasks'];

        document.getElementById('allTask').innerHTML = tasks.length;

        let categoryCounts = {
            'todo': 0,
            'in-progress': 0,
            'done': 0,
            'await-feedback': 0
        };

        let closestDateTask = null;
        let closestDateDiff = Infinity;
        let today = new Date();

        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            let category = task['category'];
            let taskDateStr = task['date'];
            
            let taskDate = parseDate(taskDateStr);
            let dateDiff = Math.abs((taskDate - today) / (1000 * 60 * 60 * 24));

            if (dateDiff < closestDateDiff) {
                closestDateDiff = dateDiff;
                closestDateTask = task;
            }

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

        if (closestDateTask) {
            document.getElementById('upComingPrioImg').src = closestDateTask['prioImg'];
            document.getElementById('upComingPrio').innerHTML = closestDateTask['prio'];

            let formattedDate = new Date(closestDateTask['date']).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            document.getElementById('upComingDate').innerHTML = formattedDate;
        }
        
    } else {
        renderSummaryGuestTasks();
    }
}

/**
 * Helper function to parse date strings in different formats 
 */
function parseDate(dateStr) {
    let parts;
    if (dateStr.includes('-')) {
        // Format: YYYY-MM-DD
        parts = dateStr.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    } else if (dateStr.includes('.')) {
        // Format: DD.MM.YYYY
        parts = dateStr.split('.');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        throw new Error("Unrecognized date format: " + dateStr);
    }
} 

/**
 * Renders the summary of tasks for guest users by updating task counts and the nearest upcoming task information on the summary page.
 */
function renderSummaryGuestTasks() {
    document.getElementById('allTask').innerHTML = guestTasks.length;

    let categoryCounts = {
        'todo': 0,
        'in-progress': 0,
        'done': 0,
        'await-feedback': 0
    };

    let closestDateTask = null;
    let closestDateDiff = Infinity;
    let today = new Date();

    for (let i = 0; i < guestTasks.length; i++) {
        let task = guestTasks[i];
        let category = task['category'];
        let taskDateStr = task['date'];

        let taskDate = parseDate(taskDateStr);
        let dateDiff = Math.abs((taskDate - today) / (1000 * 60 * 60 * 24));

        if (dateDiff < closestDateDiff) {
            closestDateDiff = dateDiff;
            closestDateTask = task;
            console.log(task)
        }

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

    if (closestDateTask) {
        document.getElementById('upComingPrioImg').src = closestDateTask['prioImg'];
        document.getElementById('upComingPrio').innerHTML = closestDateTask['prio'];
        document.getElementById('upComingDate').innerHTML = closestDateTask['date'];
    }
}

renderSummaryTasks();

function pathToBoard() {
  window.location.href = 'board.html';
}