function OpenAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    container.innerHTML = `
    <div class="left-side">
    <div class="responsive-close">
        <img onclick="closePopup()" src="assets/img/contacts/close-white.svg">
    </div>
    <div class="popup-headline">
        <img class="popup-logo" src="assets/img/contacts/logo.svg">
        <h1>Add Contact</h1>
    </div>
    <div class="subheadline">
        <p class="p">Tasks are better with a team!</p>
        <img class="underline" src="assets/img/contacts/contacts-underline.svg">
    </div>
</div>
<div class="right-side">
    <div class="right-side-icon">
        <div class="popup-icon">
            <img src="assets/img/contacts/person.svg">
        </div>
    </div>
    <div class="inputfields">
        <div class="close-button">
            <img class="close-popup" onclick="closePopup()" src="assets/img/add_task/close.svg">
        </div>
            <div class="input-container">
                <input id="contactName" class="input" placeholder="Name" type="text">
                <img class="input-icon" src="assets/img/person.svg">
            </div>
            <div class="input-container">
                <input id="contactEmail" class="input" placeholder="Email" type="text">
                <img class="input-icon" src="assets/img/mail.svg">
            </div>
            <div class="input-container">
            <input id="contactPhone" class="input" placeholder="Phone" type="text">
            <img class="input-icon" src="assets/img/contacts/call.svg">
            </div>                                    
        <div class="buttons">
            <button onclick="closePopup()" class="cancel-button">Cancel<img
                src="assets/img/add_task/close.svg"></button>
            <button onclick="newContact()" class="btn">Create Contact<img
                    src="assets/img/add_task/check.svg"></button>
        </div>
    </div>

</div>
    `;
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

function openEditPopup(name, email, phone, initials, color) {
    let container = document.getElementById('edit-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    container.innerHTML = `
    <div class="left-side">
    <div class="responsive-close">
        <img onclick="closeEditPopup()" src="assets/img/contacts/close-white.svg">
    </div>
    <div class="popup-headline">
        <img class="popup-logo" src="assets/img/contacts/logo.svg">
        <h1>Edit Contact</h1>
    </div>
</div>
<div class="right-side">
    <div class="right-side-icon">
        <div class="popup-icon">
            <div style="background-color: ${color};" class="contact-icon-big">
                <span>${initials}</span>
            </div>
        </div>
    </div>
    <div class="inputfields">
        <div class="close-button">
            <img class="close-popup" onclick="closeEditPopup()" src="assets/img/add_task/close.svg">
        </div>
            <div class="input-container">
                <input id="contactName" class="input" placeholder="Name" type="text">
                <img class="input-icon" src="assets/img/person.svg">
            </div>
            <div class="input-container">
                <input id="contactEmail" class="input" placeholder="Email" type="text">
                <img class="input-icon" src="assets/img/mail.svg">
            </div>
            <div class="input-container">
            <input id="contactPhone" class="input" placeholder="Phone" type="text">
            <img class="input-icon" src="assets/img/contacts/call.svg">
            </div>                                    
        <div class="buttons">
            <button onclick="closePopup()" class="cancel-button">Delete<img
                src="assets/img/add_task/close.svg"></button>
            <button onclick="newContact()" class="btn">Save<img
                    src="assets/img/add_task/check.svg"></button>
        </div>
    </div>

</div>
    `;

    document.getElementById('contactName').value = name;
    document.getElementById('contactEmail').value = email;
    document.getElementById('contactPhone').value = phone;

}

function closeEditPopup() {
    let container = document.getElementById('edit-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function() { 
        addClassDnone();
    }, { once: true });
}

