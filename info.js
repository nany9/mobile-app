function agree(){
    tg.requestContact(function(status, data){
        const phone = data.responseUnsafe?.contact?.phone_number;
        if (typeof(phone) === "undefined"){
            tg.showAlert("Для участия в акции необходимо предоставить номер телефона");
            tg.HapticFeedback.notificationOccurred("error");
            phone_input.value = "Нет доступа";
            location.href('https://nany9.github.io/mobile-app/');
        } else {
            if (checkNumber(phone)){
                phone_input.value = returnPhone(phone);
                tg.CloudStorage.setItem("phone", phone, function(err, saved){
                    if (err){
                        tg.showAlert("Произошла ошибка, приложение будет закрыто\nВам необходимо перезайти");
                        tg.HapticFeedback.notificationOccurred("error");
                        tg.close();
                    } else {
                        location.href('https://nany9.github.io/mobile-app/');
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
}

function disagree(){
    location.href('https://nany9.github.io/mobile-app/');
}