const tg = window.Telegram.WebApp;
document.getElementById("query").textContent = tg.initDataUnsafe?.user?.username;
tg.MainButton.text = 'Купить';
tg.MainButton.show();
