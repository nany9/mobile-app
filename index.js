const tg = window.Telegram.WebApp;
document.getElementById("query").textContent = tg.initDataUnsafe;
tg.MainButton.text = 'Купить';
tg.MainButton.show();
