function startAnimation() {
    const logo = document.getElementById('logo');
    setTimeout(() => {
      logo.src = './assets/img/logo.svg'; 
    }, 2000);
}