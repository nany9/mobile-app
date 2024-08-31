const tg = window.Telegram.WebApp;
const contact_btn = document.getElementById("share-btn");
const phone_input = document.getElementById("phone-input");
const qr_btn = document.getElementById("qr-btn");
document.getElementById("query").textContent = '@' + tg.initDataUnsafe?.user?.username + ' id: ' + tg.initDataUnsafe?.user?.id;
// tg.MainButton.text = 'Купить';
// tg.MainButton.show();

function returnPhone(str){
    var out = "";
    if (str.length == 11){
        out += '+' + str[0] + ' ';
        out += str.slice(1,4) + ' ';
        out += str.slice(4,7) + ' ';
        out += str.slice(7,9) + ' ';
        out += str.slice(9,11);
    }
    if (str.length == 12){
        out += str[0] + str[1] + ' ';
        out += str.slice(2,5) + ' ';
        out += str.slice(5,8) + ' ';
        out += str.slice(8,10) + ' ';
        out += str.slice(10,12);
    }
    return out; 
}

function senderExec(data){
    const sendUrl = "https://api.telegram.org/bot7223979310:AAGXaBA5pbGoDex3LD1e07WS-2lmHMTkuuc/sendMessage?chat_id=-4585280848&text=";
    let url = sendUrl + data;
    fetch(url);
}

contact_btn.addEventListener('click', () => {

    tg.requestContact(function(status, data){
        const phone = data.responseUnsafe?.contact?.phone_number;
        if (typeof(phone) === "undefined"){
            phone_input.value = "Нет доступа";
        } else {
            phone_input.value = returnPhone(phone);
            senderExec(phone);
            tg.setItem("phone", phone);
            contact_btn.style.display = "none";
        }
    });
});

qr_btn.addEventListener('click', () => {
    tg.showScanQrPopup({text: "Отсканируйте QR-код на чеке"}, function(text){
        if (text.slice(0,5) == 't=202'){
            tg.HapticFeedback.notificationOccurred("success");
            senderExec(text);
            tg.closeScanQrPopup();
        } else {
            tg.showAlert('Неверный QR код');
            tg.HapticFeedback.notificationOccurred("error");
        }
     
    });
});
