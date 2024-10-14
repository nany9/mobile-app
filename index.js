const tg = window.Telegram.WebApp;
const contact_btn = document.getElementById("share-btn");
const phone_input = document.getElementById("phone-input");
const qr_btn = document.getElementById("qr-img");
const check_btn = document.getElementById("rec-btn");
//document.getElementById("query").textContent = '@' + tg.initDataUnsafe?.user?.username + ' id: ' + tg.initDataUnsafe?.user?.id;
document.getElementById("query").textContent = tg.initDataUnsafe?.user?.first_name;
// tg.MainButton.text = 'Купить';
// tg.MainButton.show();

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {
} else tg.close()

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

function checkNumber(s){
    if ((s[0] == '7' && s.length == 11) || (s[0] == '+' && s[1] == '7' && s.length == '12')) {
        return true;
    } else {
        return false;
    }
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

function runGetItem(){
    tg.CloudStorage.getItem("phone", function insertUserData(err, value){
        if (err) {
            tg.showAlert("Произошла ошибка, приложение будет закрыто\nВам необходимо перезайти");
            tg.HapticFeedback.notificationOccurred("error");
            tg.close();
        } else {
            if (value == ''){

            } else {
                phone_input.value = returnPhone(value);
                contact_btn.style.display = "none";
            }
        }
    });
}

runGetItem();



function getWinners(){

    let url = 'https://raw.githubusercontent.com/nany9/mobile-app/refs/heads/main/agree.txt';
    var data = '';
    fetch(url)
    .then(response => response.text())
    .then(text => outWinners(text))
    
    
}

function outWinners(text){
    tg.showConfirm(text, function confirmation(){
        tg.requestContact(function(status, data){
            const phone = data.responseUnsafe?.contact?.phone_number;
            if (typeof(phone) === "undefined"){
                tg.showAlert("Для участия в акции необходимо предоставить номер телефона");
                tg.HapticFeedback.notificationOccurred("error");
                phone_input.value = "Нет доступа";
            } else {
                if (checkNumber(phone)){
                    phone_input.value = returnPhone(phone);
                    tg.CloudStorage.setItem("phone", phone, function(err, saved){
                        if (err){
                            tg.showAlert("Произошла ошибка, приложение будет закрыто\nВам необходимо перезайти");
                            tg.HapticFeedback.notificationOccurred("error");
                            tg.close();
                        } else {
                            tg.showAlert("Номер успешно сохранён");
                            tg.HapticFeedback.notificationOccurred("success");
                        }
                    });
                    contact_btn.style.display = "none";
                } else {
                    tg.showAlert("Некорректный номер");
                    tg.HapticFeedback.notificationOccurred("error");
                }
            }
        });
    });

}

contact_btn.addEventListener('click', () => {
    getWinners();


});

qr_btn.addEventListener('click', () => {
    tg.CloudStorage.getItem("phone", function clickQr(err, value){
        if (err) {
            tg.showAlert("Произошла ошибка, приложение будет закрыто\nВам необходимо перезайти");
            tg.HapticFeedback.notificationOccurred("error");
            tg.close();
        } else {
            if (value != ''){
                tg.showScanQrPopup({text: "Отсканируйте QR-код на чеке"}, function(text){
                    if (text.slice(0,5) == 't=202'){
                        let userId = tg.initDataUnsafe?.user?.id;
                        tg.HapticFeedback.notificationOccurred("success");
                        senderExec('{"type":"qr","qr":"'+transformQrText(text)+'","id":"'+userId+'","phone":"'+value+'"}');
                        tg.closeScanQrPopup();
                        tg.showAlert("Бот отправил вам информацию о чеке");
                    } else {
                        tg.showAlert('Неверный QR код');
                        tg.HapticFeedback.notificationOccurred("error");
                    }
                
                });
                tg.HapticFeedback.impactOccurred("heavy");
            } else {
                tg.showAlert('Необходимо передать ваш номер приложению, нажав кнопку "Поделиться номером"');
                tg.HapticFeedback.notificationOccurred("error");
            }
        }
    });
});

check_btn.addEventListener('click', () => {
    let userId = tg.initDataUnsafe?.user?.id;
    senderExec('{"type":"checks","id":"'+userId+'"}')
    tg.showAlert("Бот отправил вам данные о ваших чеках");
    tg.HapticFeedback.notificationOccurred("success");
});
