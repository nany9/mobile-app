const tg = window.Telegram.WebApp;
const contact_btn = document.getElementById("share-btn");
const phone_input = document.getElementById("phone-input");
document.getElementById("query").textContent = tg.initDataUnsafe?.user?.username;
// document.getElementById("phone-input").value = "+79042014558";
tg.MainButton.text = 'Купить';
tg.MainButton.show();

contact_btn.addEventListener('click', () => {
    tg.requestContact(function(status, phone){
        alert(status);
        console.log('status',status);
        console.log('nomer:',phone);
        phone_input.value = phone;
    });
});
