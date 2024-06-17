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

function openAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.remove('d-none');
    container.classList.remove('slide-out');
    container.innerHTML = getAddNewContactTemplate();
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

function closeEditPopup() {
    let container = document.getElementById('edit-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function() { 
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
    if(contactName) {
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

    container.classList.add('slide-in-right');
    setTimeout(() => {
        container.classList.add('active');
        container.innerHTML = getShowContactTemplate(contact, initials, contactJson, id, index);
    }, 0);
    
    contactContainer.classList.add('active');
    rightContent.classList.add('active');
    addIcon.classList.add('active');
    let editIcon = document.getElementById('edit-contact-icon');
    editIcon.classList.add('active');
}

async function deleteContact(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));

    let response = await fetch(`${firebaseUrl}/contacts/${id}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        let contactElement = document.getElementById(`showContact${id}`);
        let contactContainer = document.getElementById('contactContainer');
        let firstLetter = contact.name.charAt(0).toUpperCase();
        contactElement.remove();
        clearShowContactDetails();
        let remainingContacts = Array.from(contactContainer.getElementsByClassName('contact-card')).filter(card => 
            card.querySelector('.name').textContent.charAt(0).toUpperCase() === firstLetter
        );
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
        let showContactContainer = document.getElementById('show-contact-container');
        showContactContainer.innerHTML = '';
        showContactContainer.classList.remove('active');
        let contactContainerWrapper = document.getElementById('contact-container');
        contactContainerWrapper.classList.remove('active');
        let rightContent = document.querySelector('.right-content');
        rightContent.classList.remove('active');
        let addIcon = document.getElementById('new-contact-icon');
        addIcon.classList.remove('active');
        let editIcon = document.getElementById('edit-contact-icon');
        editIcon.classList.remove('active');
    } else {
        console.error('Fehler beim Löschen des Kontakts:', response.statusText);
    }
}

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

function clearShowContactDetails() {
    let showContactContainer = document.getElementById('show-contact-container');
    showContactContainer.innerHTML = '';
    showContactContainer.classList.remove('active');
}

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

function showNotification() {
    let notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function closeAddNewContact() {
    let container = document.getElementById('add-contact-popup');
    container.classList.add('slide-out');
    container.addEventListener('transitionend', function() { 
        addClassDnone(container);
    }, { once: true });
}