const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

function openModal(){
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('formState').style.display = 'block';
  document.getElementById('successState').classList.remove('show');
  document.getElementById('nameInput').value = '';
  document.getElementById('phoneInput').value = '';
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'modalOverlay') closeModal();
});

function submitOrder(){
  const name = document.getElementById('nameInput').value.trim();
  const phone = document.getElementById('phoneInput').value.trim();
  if(!name || !phone){
    alert('Iltimos, ism va telefon raqamingizni kiriting.');
    return;
  }
  // Mockup only: in the real site this POSTs to a backend that
  // relays the message to your Telegram bot (admins + group chat).
  document.getElementById('formState').style.display = 'none';
  document.getElementById('successState').classList.add('show');
  document.getElementById('successName').textContent = ', ' + name;
}
