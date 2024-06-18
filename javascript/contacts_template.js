function getAddNewContactTemplate() {
    return `
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
        <div>
            <div class="close-button">
                <img class="close-popup" onclick="closePopup()" src="assets/img/add_task/close.svg">
            </div>
            <form onsubmit="newContact()" class="inputfields">
                <div class="input-container">
                    <input id="contact-Name" class="input" placeholder="Name" type="text" required>
                    <img class="input-icon" src="assets/img/person.svg">
                </div>
                <div class="input-container">
                    <input id="contact-Email" class="input" placeholder="Email" type="email" required>
                    <img class="input-icon" src="assets/img/mail.svg">
                </div>
                <div class="input-container">
                    <input id="contact-Phone" class="input" placeholder="Phone" type="number" required>
                    <img class="input-icon" src="assets/img/contacts/call.svg">
                </div>                                    
                <div class="buttons">
                    <button type="button" onclick="closePopup()" class="cancel-button">Cancel<img src="assets/img/add_task/close.svg"></button>
                    <button class="btn">Create Contact<img src="assets/img/add_task/check.svg"></button>
                </div>
            </form>
        </div>
    </div>
    `;
}

function getEditContactTemplate(contact, initials, contactJson, id, index) {
    return `
    <div class="left-side">
        <div class="responsive-close">
            <img onclick="closeEditPopup()" src="assets/img/contacts/close-white.svg">
        </div>
        <div class="popup-headline">
            <img class="popup-logo" src="assets/img/contacts/logo.svg">
            <h1>Edit Contact</h1>
            <img class="underline" src="assets/img/contacts/contacts-underline.svg">
        </div>
    </div>
    <div class="right-side">
        <div class="right-side-icon">
            <div class="popup-icon">
                <div style="background-color: ${contact['color']};" class="contact-icon-big">
                    <span class="icon-initials">${initials}</span>
                </div>
            </div>
        </div>
        <div>
            <div class="close-button">
                <img class="close-popup" onclick="closeEditPopup()" src="assets/img/add_task/close.svg">
            </div>
            <form class="inputfields">
                <div class="input-container">
                    <input id="contactName" class="input" placeholder="Name" type="text" required>
                    <img class="input-icon" src="assets/img/person.svg">
                </div>
                <div class="input-container">
                    <input id="contactEmail" class="input" placeholder="Email" type="email" required>
                    <img class="input-icon" src="assets/img/mail.svg">
                </div>
                <div class="input-container">
                    <input id="contactPhone" class="input" placeholder="Phone" type="text" required>
                    <img class="input-icon" src="assets/img/contacts/call.svg">
                </div>                                    
                <div class="buttons">
                    <button type="button" onclick="deleteContact('${contactJson}', '${id}', '${index}')" class="delete-button">Delete<img src="assets/img/add_task/close.svg"></button>
                    <button type="button" onclick="saveEditedContact('${contactJson}', '${id}', '${index}')" class="btn">Save<img src="assets/img/add_task/check.svg"></button>
                </div>
            </form>
        </div>
    </div>
    `;
}


function getShowContactTemplate(contact, initials, contactJson, id, index) {
    return `
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
}