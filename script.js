// ====== TELEGRAM SOZLAMALARI ======
// Bot tokeningizni shu yerga qo'ying (masalan: BotFather'dan olgan "123456:ABC-def...")
const TELEGRAM_BOT_TOKEN = "8867305064:AAFNlTUi2sKW4f8qyHnWyM3jIhU1sw8QGks";

// Xabar boradigan chat ID'lar: har bir admin va guruh uchun alohida ID.
// Guruh ID'lari odatda manfiy son bo'ladi (masalan -1001234567890).
const TELEGRAM_CHAT_IDS = [
  "6346184642",
  "4459345647",
  "5546399052"
];
// ===================================

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

  const submitBtn = document.querySelector('#formState .btn-primary');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Yuborilmoqda...';

  const text = `🧼 *Yangi buyurtma — Aqua Gilam*\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}`;

  const sendPromises = TELEGRAM_CHAT_IDS.map(chatId =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    })
  );

  Promise.all(sendPromises)
    .then(() => {
      document.getElementById('formState').style.display = 'none';
      document.getElementById('successState').classList.add('show');
      document.getElementById('successName').textContent = ', ' + name;
    })
    .catch(err => {
      console.error('Telegram xabar yuborishda xatolik:', err);
      alert('Xabar yuborilmadi. Internet aloqasini tekshiring yoki BOT_TOKEN/CHAT_ID to\'g\'riligiga ishonch hosil qiling.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Yuborish';
    });
}
