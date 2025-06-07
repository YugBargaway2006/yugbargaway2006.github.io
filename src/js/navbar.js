function initNavbar() {
  const toggleBtn = document.querySelector('.menu')
  const toggleBtnIcon = document.querySelector('.menu i')
  const dropDownMenu = document.querySelector('.dropdown-box')

  toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open')
    const isOpen = dropDownMenu.classList.contains('open')

    toggleBtnIcon.className = isOpen
      ? 'fa-solid fa-xmark'
      : 'fa-solid fa-bars'
  }

  // Clock working
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
  }

  updateClock();
  setInterval(updateClock, 1000);
}
