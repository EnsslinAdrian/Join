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
 * This function renders a responsive summary by hiding and showing elements in a specific sequence.
 * 
 * @param {HTMLElement} headline - The main headline element to be hidden.
 * @param {HTMLElement} headlineResponsiv - The responsive headline element to be shown.
 * @param {HTMLElement} taskDashboard - The task dashboard element to be shown.
 * @param {HTMLElement} greet - The greeting element to be shown and then hidden.
 */
function renderResponsiveSummaryBelow(headline, headlineResponsiv, taskDashboard, greet) {
    headline.classList.add('d-none');
    headlineResponsiv.classList.add('d-none');
    taskDashboard.classList.add('d-none');
    greet.classList.add('d-none');
    setTimeout(() => {
        greet.classList.remove('d-none');
    }, 100);
    setTimeout(() => {
        greet.classList.add('d-none');
        headlineResponsiv.classList.remove('d-none');
        taskDashboard.classList.remove('d-none');
        isRendering = false;
    }, 1500);
}


/**
 * This function renders a responsive summary by showing and hiding elements in a specific sequence.
 * 
 * @param {HTMLElement} headline - The main headline element to be shown.
 * @param {HTMLElement} headlineResponsiv - The responsive headline element to be hidden.
 * @param {HTMLElement} taskDashboard - The task dashboard element to be shown.
 * @param {HTMLElement} greet - The greeting element to be hidden.
 */
function renderResponsiveSummaryAbove(headline, headlineResponsiv, taskDashboard, greet) {
    headline.classList.remove('d-none');
    headlineResponsiv.classList.add('d-none');
    taskDashboard.classList.remove('d-none');
    greet.classList.remove('d-none');
    isRendering = false;
}


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
        renderResponsiveSummaryBelow(headline, headlineResponsiv, taskDashboard, greet, isRendering);
    } else {
        renderResponsiveSummaryAbove(headline, headlineResponsiv, taskDashboard, greet, isRendering);
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
        let tasks = await fetchUserTasks();

        if (!Array.isArray(tasks)) {
            tasks = [];
        }
        updateTaskCount(tasks.length);

        let categoryCounts = countTaskCategories(tasks);
        updateCategoryCounts(categoryCounts);

        let closestDateTask = findClosestDateTask(tasks);
        updateClosestDateTask(closestDateTask);
    } else {
        renderSummaryGuestTasks();
    }
}


/**
 * Fetches the tasks of the logged-in user from the database.
 * 
 * @returns {Array} The list of tasks.
 */
async function fetchUserTasks() {
    let response = await fetch('https://join-69a70-default-rtdb.europe-west1.firebasedatabase.app/' + '.json');
    let responseToJson = await response.json();

    let user = localStorage.getItem('userKey');
    let pathUser = responseToJson['registered'][user];
    return pathUser['tasks'];
}


/**
 * Updates the total task count in the HTML.
 * 
 * @param {number} count - The total number of tasks.
 */
function updateTaskCount(count) {
    document.getElementById('allTask').innerHTML = count;
}


/**
 * Counts the tasks in different categories.
 * 
 * @param {Array} tasks - The list of tasks.
 * @returns {Object} The counts of tasks in each category.
 */
function countTaskCategories(tasks) {
    let categoryCounts = {
        'todo': 0,
        'in-progress': 0,
        'done': 0,
        'await-feedback': 0
    };

    for (let i = 0; i < tasks.length; i++) {
        let category = tasks[i]['category'];
        if (categoryCounts.hasOwnProperty(category)) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    }

    return categoryCounts;
}


/**
 * Finds the task with the closest due date.
 * 
 * @param {Array} tasks - The list of tasks.
 * @returns {Object} The task with the closest due date.
 */
function findClosestDateTask(tasks) {
    let closestDateTask = null;
    let closestDateDiff = Infinity;
    let today = new Date();

    for (let i = 0; i < tasks.length; i++) {
        let taskDateStr = tasks[i]['date'];
        let taskDate = parseDate(taskDateStr);
        let dateDiff = Math.abs((taskDate - today) / (1000 * 60 * 60 * 24));

        if (dateDiff < closestDateDiff) {
            closestDateDiff = dateDiff;
            closestDateTask = tasks[i];
        }
    }

    return closestDateTask;
}


/**
 * Updates the HTML with the counts of tasks in each category.
 * 
 * @param {Object} categoryCounts - The counts of tasks in each category.
 */
function updateCategoryCounts(categoryCounts) {
    document.getElementById('todoSummary').innerHTML = categoryCounts['todo'];
    document.getElementById('inProgressSummary').innerHTML = categoryCounts['in-progress'];
    document.getElementById('doneSummary').innerHTML = categoryCounts['done'];
    document.getElementById('awaitingSummary').innerHTML = categoryCounts['await-feedback'];
}


/**
 * Updates the HTML with the task having the closest due date.
 * 
 * @param {Object} task - The task with the closest due date.
 */
function updateClosestDateTask(task) {
    if (task) {
        document.getElementById('upComingPrioImg').src = task['prioImg'];
        document.getElementById('upComingPrio').innerHTML = task['prio'];

        let formattedDate = new Date(task['date']).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('upComingDate').innerHTML = formattedDate;
    } else {
        document.getElementById('upComingDate').innerHTML = 'Keine bevorstehenden Aufgaben';
        document.getElementById('prioCurrent').innerHTML = '0';
        document.getElementById('upComingPrio').innerHTML = '';
        document.getElementById('upComingPrioImg').classList.add('d-none');
    }
}


/**
 * Parses a date string in the format 'DD.MM.YYYY' or 'YYYY-MM-DD' into a Date object.
 * 
 * @param {string} dateStr - The date string to parse.
 * @returns {Date} The parsed Date object.
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
    updateTaskCount(guestTasks.length);

    let categoryCounts = countTaskCategories(guestTasks);
    updateCategoryCounts(categoryCounts);

    let closestDateTask = findClosestDateTask(guestTasks);
    updateClosestDateTask(closestDateTask);
}

renderSummaryTasks();


/**
 * This function redirects the browser to the board.html page.
 * 
 * @function pathToBoard
 */
function pathToBoard() {
    window.location.href = 'board.html';
}