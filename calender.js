// Side bar toggle buttton
const toggleSidebarButton = document.querySelector('.header__toggle-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarCloseBtn = document.querySelector('.sidebar__closeBtn');

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});
sidebarCloseBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});
