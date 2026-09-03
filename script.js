// ====== TELEGRAM SOZLAMALARI ======
// Bot tokeningizni shu yerga qo'ying (masalan: BotFather'dan olgan "123456:ABC-def...")
const TELEGRAM_BOT_TOKEN = "8867305064:AAFNlTUi2sKW4f8qyHnWyM3jIhU1sw8QGks";

// Xabar boradigan chat ID'lar: har bir admin va guruh uchun alohida ID.
// Guruh ID'lari odatda manfiy son bo'ladi (masalan -1001234567890).
const TELEGRAM_CHAT_IDS = [
  "6346184642",
  "558695914",
  "-1004459345647"
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

// Telefon raqamni "XX XXX XX XX" ko'rinishida avtomatik formatlaydi (+998 alohida ko'rinadi)
const phoneInputEl = document.getElementById('phoneInput');
phoneInputEl.addEventListener('input', () => {
  let digits = phoneInputEl.value.replace(/\D/g, '').slice(0, 9);
  const groups = [digits.slice(0,2), digits.slice(2,5), digits.slice(5,7), digits.slice(7,9)];
  phoneInputEl.value = groups.filter(g => g.length > 0).join(' ');
});

function getFullPhone(){
  const digits = phoneInputEl.value.replace(/\D/g, '');
  return '+998 ' + phoneInputEl.value.trim();
}

function formatDateTimeUz(){
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function submitOrder(){
  const name = document.getElementById('nameInput').value.trim();
  const phoneDigits = phoneInputEl.value.replace(/\D/g, '');
  if(!name || phoneDigits.length < 9){
    alert('Iltimos, ism va to\'liq telefon raqamingizni kiriting (9 ta raqam).');
    return;
  }
  const phone = getFullPhone();

  const submitBtn = document.querySelector('#formState .btn-primary');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Yuborilmoqda...';

  const text = `🧼 *Yangi buyurtma — Karvonclean*\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n🕐 Vaqt: ${formatDateTimeUz()}`;

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
      .then(res => res.json())
      .then(data => ({ chatId, ...data }))
      .catch(() => ({ chatId, ok: false, description: 'Tarmoq xatosi' }))
  );

  Promise.all(sendPromises).then(results => {
    const failed = results.filter(r => !r.ok);

    if(failed.length){
      console.error('Telegramga yuborilmadi:', failed);
      const details = failed.map(f => `• ${f.chatId}: ${f.description || 'noma\'lum xato'}`).join('\n');
      alert('Ba\'zi chatlarga xabar yetib bormadi:\n\n' + details + '\n\nBrauzer konsolida (F12) batafsilroq ko\'ring.');
    }

    if(results.some(r => r.ok)){
      document.getElementById('formState').style.display = 'none';
      document.getElementById('successState').classList.add('show');
      document.getElementById('successName').textContent = ', ' + name;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Yuborish';
  });
}
