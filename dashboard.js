// Side bar toggle buttton
const toggleSidebarButton = document.querySelector('.header__toggle-btn');
const sidebar = document.querySelector('.sidebar');

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});
