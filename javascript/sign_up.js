function showConfirmedPassword() {
    let showPassword = document.getElementById('visibility-cofirm-password-off');
    let showPasswordNot = document.getElementById('visibility-cofirm-password');
    showPassword.classList.remove("visibility-off-toggle");
    showPassword.classList.add("d_none");
    showPasswordNot.classList.remove("d_none");
    document.getElementById('confirmLoginPassword').type = 'text';
}


function showConfirmedPasswordNot() {
    let showPassword = document.getElementById('visibility-cofirm-password-off');
    let showPasswordNot = document.getElementById('visibility-cofirm-password');
    showPassword.classList.add("visibility-off-toggle");
    showPassword.classList.remove("d_none");
    showPasswordNot.classList.add("d_none");
    document.getElementById('confirmLoginPassword').type = 'password';
}

