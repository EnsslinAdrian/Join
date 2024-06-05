/**
 * Toggles the visibility of the confirmed password input field.
 * Switches the confirmed password input type from 'password' to 'text',
 * and updates the visibility icons accordingly.
 */
function showConfirmedPassword() {
    let showPassword = document.getElementById('visibility-cofirm-password-off');
    let showPasswordNot = document.getElementById('visibility-cofirm-password');
    showPassword.classList.remove("visibility-off-toggle");
    showPassword.classList.add("d_none");
    showPasswordNot.classList.remove("d_none");
    document.getElementById('confirmLoginPassword').type = 'text';
}

/**
 * Toggles the visibility of the confirmed password input field.
 * Switches the confirmed password input type from 'text' back to 'password',
 * and updates the visibility icons accordingly.
 */
function showConfirmedPasswordNot() {
    let showPassword = document.getElementById('visibility-cofirm-password-off');
    let showPasswordNot = document.getElementById('visibility-cofirm-password');
    showPassword.classList.add("visibility-off-toggle");
    showPassword.classList.remove("d_none");
    showPasswordNot.classList.add("d_none");
    document.getElementById('confirmLoginPassword').type = 'password';
}

