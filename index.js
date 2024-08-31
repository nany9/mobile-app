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

function transformQrText(str){
    var new_str = str.replace(/&/g, "%26");
    var str = new_str;
    var new_str = str.replace(/=/g, "%3D");
    return new_str;
}

function senderExec(data){
    const sendUrl = "https://api.telegram.org/bot7223979310:AAGXaBA5pbGoDex3LD1e07WS-2lmHMTkuuc/sendMessage?chat_id=-1002246333261&text=";
    let url = sendUrl + data;
    fetch(url);
}

tg.CloudStorage.getItem("phone", function(err, value){
    console.log('Err: ' + err);
    console.log('Value: ' + value);
    console.log('typeof value: ' + typeof(value));
    if (err) {
        tg.showAlert("Error:" + err);
        qr_btn.disabled = true;
    } else {
        if (value == ''){
            qr_btn.disabled = true;
        } else {
            phone_input.value = returnPhone(value);
            contact_btn.style.display = "none";
            qr_btn.disabled = false;

        }
 
    }
});

contact_btn.addEventListener('click', () => {

    tg.requestContact(function(status, data){
        const phone = data.responseUnsafe?.contact?.phone_number;
        if (typeof(phone) === "undefined"){
            phone_input.value = "Нет доступа";
        } else {
            phone_input.value = returnPhone(phone);
            senderExec(phone);
            tg.CloudStorage.setItem("phone", phone, function(err, saved){
                if (err){
                    tg.showAlert("Error:" + err);
                } else {
                    tg.showAlert("Номер успешно сохранён");
                    tg.HapticFeedback.notificationOccurred("success");
                }
            });
            contact_btn.style.display = "none";
        }
    });
});

qr_btn.addEventListener('click', () => {
    tg.showScanQrPopup({text: "Отсканируйте QR-код на чеке"}, function(text){
        if (text.slice(0,5) == 't=202'){
            let userId = tg.initDataUnsafe?.user?.id;
            tg.HapticFeedback.notificationOccurred("success");
            senderExec('{"qr":"'+transformQrText(text)+'","id":"'+userId+'"}');
            tg.closeScanQrPopup();
        } else {
            tg.showAlert('Неверный QR код');
            tg.HapticFeedback.notificationOccurred("error");
        }
     
    });
});
