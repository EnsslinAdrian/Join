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