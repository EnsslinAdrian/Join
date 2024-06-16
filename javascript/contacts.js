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
 * Fetches and renders contacts from the specified path in the Firebase database.
 * If the current page is contacts.html, it updates the contact container with
 * the fetched contact data.
 * 
 * @param {string} path - The path to append to the Firebase URL for fetching contacts.
 * @returns {Promise<void>}
 */
async function renderContacts(path = "") {
    if (window.location.pathname.endsWith("contacts.html")) {
        let response = await fetch(firebaseUrl + '.json');
        let responseToJson = await response.json();

        let content = document.getElementById('contactContainer');
        let contacts = responseToJson.contacts;
        let contactsArray = Object.values(contacts);

        // Sort contactsArray alphabetically by name
        contactsArray.sort((a, b) => a.name.localeCompare(b.name));

        content.innerHTML = "";

        let currentLetter = "";
        for (let contact of contactsArray) {
            let key = Object.keys(contacts).find(k => contacts[k] === contact);
            contact.id = key;
            
            let firstLetter = contact.name.charAt(0).toUpperCase();
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                content.innerHTML += `
                <span class="register-letter">${currentLetter}</span>
                <div>
                    <img src="assets/img/contacts/contact-seperator.svg" alt="">
                </div>`;
            }
            content.innerHTML += generateContactHtml(contact, key, contactsArray.indexOf(contact));
        }
    }
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
    container.classList.add('active');
    contactContainer.classList.add('active');
    rightContent.classList.add('active');
    addIcon.classList.add('active');
    container.innerHTML = getShowContactTemplate(contact, initials, contactJson, id, index);
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
        document.getElementById(`showContact${id}`).remove();
        clearShowContactDetails();
        document.getElementById('edit-contact-popup').classList.add('d-none');
    } else {
        console.error('Fehler beim Löschen des Kontakts:', response.statusText);
    }
}

async function saveEditedContact(contactJson, id, index) {
    let contact = JSON.parse(decodeURIComponent(contactJson));
    console.log(contact);
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