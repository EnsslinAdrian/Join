/**
 * This function creates a new contact and updates the UI accordingly.
 * 
 * @async
 * @function newContact
 * @returns {Promise<void>}
 */
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
    closeAddNewContact();
    showContact(JSON.stringify(contact), newContactId, newContactIndex);
    showNotification();
    changeBgColor(`showContact${newContactId}`);
}


/**
 * This funtction opens the "Add New Contact" popup.
 * 
 * @function openAddNewContact
 */
function openAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    container.innerHTML = getAddNewContactTemplate();
}


/**
 * This function adds the 'd-none' class to the "Add New Contact" popup container.
 * 
 * @function addClassDnone
 */
function addClassDnone() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('d-none');
    container.classList.remove('slide-out')
}


/**
 * Th8is function closes the "Add New Contact" popup with a slide-out animation.
 * 
 * @function closePopup
 */
function closePopup() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function () {
        addClassDnone();
    }, { once: true });
}


/**
 * This function opens the "Edit Contact" popup and populates it with the contact's details.
 * 
 * @function openEditPopup
 * @param {string} contactJson - The JSON string representation of the contact.
 * @param {string} id - The ID of the contact.
 * @param {number} index - The index of the contact in the list.
 */
function openEditPopup(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));
    let contactName = contact['name'];
    let initials = contactName.split(' ').map(word => word[0]).join('');
    let container = document.getElementById('edit-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    container.innerHTML = getEditContactTemplate(contact, initials, contactJson, id, index);

    document.getElementById('contactName').value = contact['name'];
    document.getElementById('contactEmail').value = contact['email'];
    document.getElementById('contactPhone').value = contact['phone'];

}


/**
 * This function closes the "Edit Contact" popup with a slide-out animation.
 * 
 * @function closeEditPopup
 */
function closeEditPopup() {
    let container = document.getElementById('edit-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function () {
        container.classList.add('d-none');
    }, { once: true });
}


/**
 * Generates the HTML for a contact card.
 * 
 * @param {Object} contact - The contact object containing the contact details.
 * @param {number} index - The index of the contact in the contact list.
 * @returns {string} The generated HTML string for the contact card.
 */
function generateContactHtml(contact, id, index) {
    let contactName = contact['name'];
    if (contactName) {
        let initials = contactName.split(' ').map(word => word[0]).join('');
        let contactStr = encodeURIComponent(JSON.stringify(contact));
        return `
    <div id="showContact${id}" onclick="showContact('${contactStr}', '${id}', '${index}'); changeBgColor('showContact${id}')" class="contact-card">
        <div style="background-color: ${contact['color']};" class="contact-icon">
            <span>${initials}</span>
        </div>
        <div class="contact">
            <span class="name">${contact['name']}</span>
            <a>${contact['email']}</a>
        </div>
    </div>
  `;
    } else {
        console.error("Fehler: Der Name des Kontakts ist undefiniert.");
        return '';
    }
}


/**
 * This function displays the contact details in the UI.
 * 
 * @function showContact
 * @param {string} contactStr - The JSON string representation of the contact.
 * @param {string} id - The ID of the contact.
 * @param {number} index - The index of the contact in the list.
 */
function showContact(contactStr, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactStr));
    let contactName = contact['name'];
    let contactJson = encodeURIComponent(JSON.stringify(contact));
    let initials = contactName.split(' ').map(word => word[0]).join('');
    let container = document.getElementById('show-contact-container');
    let contactContainer = document.getElementById('contact-container');
    let rightContent = document.querySelector('.right-content');
    let addIcon = document.getElementById('new-contact-icon');

    container.innerHTML = '';
    container.classList.remove('active');

    contactTemplateAnimation(contactContainer, rightContent, addIcon, container, contact, initials, contactJson, id, index);
}


/**
 * This function animates and displays the contact details in the UI.
 * 
 * @function contactTemplateAnimation
 * @param {HTMLElement} contactContainer - The container element for contacts.
 * @param {HTMLElement} rightContent - The right content element in the UI.
 * @param {HTMLElement} addIcon - The icon element for adding a new contact.
 * @param {HTMLElement} container - The container element for showing contact details.
 * @param {Object} contact - The contact object containing details of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} contactJson - The JSON string representation of the contact.
 * @param {string} id - The ID of the contact.
 * @param {number} index - The index of the contact in the list.
 */
function contactTemplateAnimation(contactContainer, rightContent, addIcon, container, contact, initials, contactJson, id, index) {
    container.classList.add('slide-in-right');
    setTimeout(() => {
        container.classList.add('active');
        container.innerHTML = getShowContactTemplate(contact, initials, contactJson, id, index);
        let editIcon = document.getElementById('edit-contact-icon');
        if (!editIcon) {
            console.error('Element with id "edit-contact-icon" not found after rendering');
            return;
        }
        editIcon.classList.remove('d-none');
        editIcon.classList.add('active');
    }, 0);
    contactContainer.classList.add('active');
    rightContent.classList.add('active');
    addIcon.classList.add('active');
}


/**
 * This function deletes the contact and updates the UI accordingly.
 * 
 * @async
 * @function deleteContact
 * @param {string} contactJson - The JSON string representation of the contact.
 * @param {string} id - The ID of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {Promise<void>}
 */
async function deleteContact(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));
    try {
        await deleteContactDataBank(contact, id);
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
}


/**
 * This function deletes the contact from the database.
 * 
 * @async
 * @function deleteContactDataBank
 * @param {Object} contact - The contact object containing details of the contact.
 * @param {string} id - The ID of the contact.
 * @returns {Promise<void>}
 */
async function deleteContactDataBank(contact, id) {
    let response = await fetch(`${firebaseUrl}/contacts/${id}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        removeContactElement(id);
        clearShowContactDetails();
        updateUIAfterContactDeletion(contact);
    } else {
        console.error('Fehler beim Löschen des Kontakts:', response.statusText);
    }
}


/**
 * This function removes the contact element from the UI.
 * 
 * @function removeContactElement
 * @param {string} id - The ID of the contact.
 */
function removeContactElement(id) {
    let contactElement = document.getElementById(`showContact${id}`);
    if (contactElement) {
        contactElement.remove();
    }
}


/**
 * This function clears the details shown in the contact details container and updates the UI.
 * 
 * @function clearShowContactDetails
 */
function clearShowContactDetails() {
    let showContactContainer = document.getElementById('show-contact-container');
    clearShowContactContainerDetails(showContactContainer);

    let contactContainerWrapper = document.getElementById('contact-container');
    clearContactContainerWrapper(contactContainerWrapper);

    let rightContent = document.querySelector('.right-content');
    clearRightContent(rightContent);

    let addIcon = document.getElementById('new-contact-icon');
    clearAddIcon(addIcon);
    
    let editIcon = document.getElementById('edit-contact-icon');
    clearEditIcon(editIcon);
}


/**
 * This function clears the content and active class of the contact details container.
 * 
 * @function clearShowContactContainerDetails
 * @param {HTMLElement} showContactContainer - The container element for showing contact details.
 */
function clearShowContactContainerDetails(showContactContainer) {
    if (showContactContainer) {
        showContactContainer.innerHTML = '';
        showContactContainer.classList.remove('active');
    }
}


/**
 * This function removes the active class from the contact container wrapper.
 * 
 * @function clearContactContainerWrapper
 * @param {HTMLElement} contactContainerWrapper - The container element for contacts.
 */
function clearContactContainerWrapper(contactContainerWrapper) {
    if (contactContainerWrapper) {
        contactContainerWrapper.classList.remove('active');
    }
}


/**
 * This function removes the active class from the right content element.
 * 
 * @function clearRightContent
 * @param {HTMLElement} rightContent - The right content element in the UI.
 */
function clearRightContent(rightContent) {
    if (rightContent) {
        rightContent.classList.remove('active');
    }
}


/**
 * This function removes the active class from the add new contact icon.
 * 
 * @function clearAddIcon
 * @param {HTMLElement} addIcon - The icon element for adding a new contact.
 */
function clearAddIcon(addIcon) {
    if (addIcon) {
        addIcon.classList.remove('active');
    }
}


/**
 * This function removes the active class from the edit contact icon.
 * 
 * @function clearEditIcon
 * @param {HTMLElement} editIcon - The icon element for editing a contact.
 */
function clearEditIcon(editIcon) {
    if (editIcon) {
        editIcon.classList.remove('active');
    }
}


/**
 * This function updates the UI after a contact is deleted by removing corresponding elements.
 * 
 * @function updateUIAfterContactDeletion
 * @param {Object} contact - The contact object containing details of the contact.
 */
function updateUIAfterContactDeletion(contact) {
    let contactContainer = document.getElementById('contactContainer');
    if (!contactContainer) return;

    let firstLetter = contact.name.charAt(0).toUpperCase();
    let remainingContacts = Array.from(contactContainer.getElementsByClassName('contact-card')).filter(card =>
        card.querySelector('.name').textContent.charAt(0).toUpperCase() === firstLetter
    );

    remainingTheContacts(contactContainer, firstLetter, remainingContacts);
}


/**
 * This function removes the register letter and separator elements if no contacts are left with the same first letter.
 * 
 * @function remainingTheContacts
 * @param {HTMLElement} contactContainer - The container element for contacts.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {HTMLElement[]} remainingContacts - The remaining contact elements.
 */
function remainingTheContacts(contactContainer, firstLetter, remainingContacts) {
    if (remainingContacts.length === 0) {
        let registerLetterElements = Array.from(contactContainer.getElementsByClassName('register-letter'));
        for (let registerLetterElement of registerLetterElements) {
            if (registerLetterElement.textContent === firstLetter) {
                let separatorElement = registerLetterElement.nextElementSibling;
                registerLetterElement.remove();
                if (separatorElement && separatorElement.tagName === 'DIV' && separatorElement.querySelector('img')) {
                    separatorElement.remove();
                }
                break;
            }
        }
    }
}


/**
 * This function saves the edited contact information to the database.
 * 
 * @async
 * @function saveEditedContact
 * @param {string} contactJson - The JSON string of the original contact information.
 * @param {string} id - The unique identifier of the contact.
 * @param {number} index - The index of the contact in the contacts list.
 */
async function saveEditedContact(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));
    let newName = document.getElementById('contactName').value;
    let newEmail = document.getElementById('contactEmail').value;
    let newPhone = document.getElementById('contactPhone').value;

    let updatedContact = {
        'name': newName,
        'email': newEmail,
        'phone': newPhone,
        'color': contact['color']
    };

    await saveEditedContactDataBank(id, index, updatedContact);
}


/**
 * This function saves the edited contact information to the database.
 * 
 * @async
 * @function saveEditedContactDataBank
 * @param {string} id - The unique identifier of the contact.
 * @param {number} index - The index of the contact in the contacts list.
 * @param {Object} updatedContact - The updated contact information.
 */
async function saveEditedContactDataBank(id, index, updatedContact) {
    let response = await fetch(`${firebaseUrl}/contacts/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
    });

    if (response.ok) {
        await renderContacts();
        showContact(JSON.stringify(updatedContact), id, index);
        closeEditPopup();
    } else {
        console.error('Fehler beim Speichern des bearbeiteten Kontakts:', response.statusText);
    }
}


/**
 * This function clears the details shown in the contact details container.
 * 
 * @function clearShowContactDetails
 */
function clearShowContactDetails() {
    let showContactContainer = document.getElementById('show-contact-container');
    showContactContainer.innerHTML = '';
    showContactContainer.classList.remove('active');
}


/**
 * This function changes the background color of the selected contact.
 * 
 * @function changeBgColor
 * @param {string} contact - The id of the selected contact element.
 */
function changeBgColor(contact) {
    let contacts = document.querySelectorAll('.contact-card');
    contacts.forEach(contact => {
        contact.style.backgroundColor = '';
        contact.style.color = '';
    });

    let clickedContact = document.getElementById(contact);
    if (clickedContact) {
        clickedContact.style.backgroundColor = '#2B3647';
        clickedContact.style.color = 'white';
    }
}


/**
 * This function clears the content and active classes of various UI elements.
 * 
 * @function clearShowContactContainer
 */
function clearShowContactContainer() {
    let contactContainer = document.getElementById('contact-container');
    let showContactContainer = document.getElementById('show-contact-container');
    let rightContent = document.querySelector('.right-content');
    let addIcon = document.getElementById('new-contact-icon');
    let editIcon = document.getElementById('edit-contact-icon');

    showContactContainer.innerHTML = '';
    showContactContainer.classList.remove('active');
    contactContainer.classList.remove('active');
    rightContent.classList.remove('active');
    addIcon.classList.remove('active');
    editIcon.classList.remove('active');
}


/**
 * This function displays a notification for a short duration.
 * 
 * @function showNotification
 */
function showNotification() {
    let notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}


/**
 * This function closes the 'Add New Contact' popup with a slide-out animation.
 * 
 * @function closeAddNewContact
 */
function closeAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function () {
        addClassDnone(container);
    }, { once: true });
}