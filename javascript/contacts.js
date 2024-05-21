function addNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    // container.innerHTML = `
    
    // `;
}

function addClassDnone(){
    let container = document.getElementById('add-contact-popup');
    container.classList.add('d-none');
    container.classList.remove('slide-out')
}

function closePopup() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function() { 
        addClassDnone();
    }, { once: true });
}


