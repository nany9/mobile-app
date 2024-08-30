const tg = window.Telegram.WebApp;
const contact_btn = document.getElementById("share-btn");
const phone_input = document.getElementById("phone-input");
document.getElementById("query").textContent = tg.initDataUnsafe?.user?.username;
tg.MainButton.text = 'Купить';
tg.MainButton.show();

contact_btn.addEventListener('click', () => {
    tg.requestContact(function(status, data){
        const phone = data.responseUnsafe?.contact?.phone_number;
        phone_input.value = phone;
    });
});
