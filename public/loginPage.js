"use strict";

const userform = new UserForm();

userform.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success) {
            location.reload();
        } else {
            alert(response.error);
        }
    });
}

userform.registerFormCallback = data => {
    ApiConnector.register(data, response => {
        if (response.success) {
            console.log(response);
            location.reload();
        } else {
            alert(response.error);
        }
    });
}