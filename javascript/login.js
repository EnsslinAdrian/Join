function showPassword() {
    let showPassword = document.getElementById('visibility-off-toggle');
    let showPasswordNot = document.getElementById('visibility-toggle');
    showPassword.classList.remove("visibility-off-toggle");
    showPassword.classList.add("d_none");
    showPasswordNot.classList.remove("d_none");
    document.getElementById('loginPassword').type = 'text';
}


function showPasswordNot() {
    let showPassword = document.getElementById('visibility-off-toggle');
    let showPasswordNot = document.getElementById('visibility-toggle');
    showPassword.classList.add("visibility-off-toggle");
    showPassword.classList.remove("d_none");
    showPasswordNot.classList.add("d_none");
    document.getElementById('loginPassword').type = 'password';
}
