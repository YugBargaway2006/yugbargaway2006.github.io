fetch('../components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar-placeholder').innerHTML = html;
    initNavbar();  // call this after navbar is added to DOM
  })
  .catch(err => console.error('Navbar load failed', err));
