/**
 * Toggles the visibility of the password input field.
 * Switches the password input type from 'password' to 'text',
 * and updates the visibility icons accordingly.
 */
function showPassword() {
    let showPassword = document.getElementById('visibility-off-toggle');
    let showPasswordNot = document.getElementById('visibility-toggle');
    showPassword.classList.remove("visibility-off-toggle");
    showPassword.classList.add("d_none");
    showPasswordNot.classList.remove("d_none");
    document.getElementById('loginPassword').type = 'text';
}


/**
 * Toggles the visibility of the password input field.
 * Switches the password input type from 'text' back to 'password',
 * and updates the visibility icons accordingly.
 */
function showPasswordNot() {
    let showPassword = document.getElementById('visibility-off-toggle');
    let showPasswordNot = document.getElementById('visibility-toggle');
    showPassword.classList.add("visibility-off-toggle");
    showPassword.classList.remove("d_none");
    showPasswordNot.classList.add("d_none");
    document.getElementById('loginPassword').type = 'password';
}
