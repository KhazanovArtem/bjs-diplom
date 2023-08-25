const logout = new LogoutButton();

logout.action = () => {
    ApiConnector.logout(data => {
        if (data) {
            location.reload();
        }
    })
}


ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});


const board = new RatesBoard();

function getCourse(data) {
    board.clearTable();
    const course = {};
    for (prop in data.Valute) {
        course[prop] = data.Valute[prop].Value;
    }
    board.fillTable(course);
}

function requestCourse() {
    $.getJSON("https://www.cbr-xml-daily.ru/daily_json.js", function (data) {
        if (data != null) {
            getCourse(data);
        } else alert("Ошибка запроса");
    });
}

requestCourse();
setInterval(requestCourse, 60000);


const manager = new MoneyManager();

manager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            manager.errorMessageBlock = manager.setMessage(response.success, "Валюта успешно добавлена");
        } else {
             manager.errorMessageBlock = manager.setMessage(response.success, "Возникла ошибка при добавлении валюты")
            }
    });
}

manager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            manager.setMessage(response.success, "Конвертирование проведено успешно");
        } else {
             manager.setMessage(response.success, response.error)
            }
    });
}

manager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            manager.setMessage(response.success, "Перевод валюты проведен успешно");
        } else {
             manager.setMessage(response.success, response.error)
            }
    });
}


const favorite = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        manager.updateUsersList(response.data);
    }
})

favorite.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            manager.updateUsersList(response.data);
            favorite.setMessage(response.success, "Пользователь добавлен в адресную книгу");
        } else {favorite.setMessage(response.success, response.error);}
    })
}

favorite.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            manager.updateUsersList(response.data);
            favorite.setMessage(response.success, "Пользователь удален");
        } else {favorite.setMessage(response.success, response.error);}
    })
}