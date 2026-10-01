const btn = document.querySelector('.chat-sidebar-profile-toggle');

if (btn) {
  btn.addEventListener('click', () => {
    document.querySelector('.chat-sidebar-profile')
      .classList.toggle('active');
  });
}