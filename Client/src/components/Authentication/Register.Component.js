import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        this.validateAddress = this.validateAddress.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateConfirmedPassword = this.validateConfirmedPassword.bind(this);
        this.existingUsername = this.existingUsername.bind(this);
        this.existingEmail = this.existingEmail.bind(this);


        this.validMin = this.validMin.bind(this);
        this.validChars = this.validChars.bind(this);
        this.validMax = this.validMax.bind(this);
        this.validateName = this.validateName.bind(this);
        this.clearError = this.clearError.bind(this);
    }


    validMin(input) {
        return input.length >= 3;
    }

    validChars(input) {
        const valid = true;
        for (let i = 0; i < input.length; ++i) {
            if (input.charCodeAt(i) !== 32 && (input.charCodeAt(i) < 65 || (input.charCodeAt(i) > 90 && input.charCodeAt(i) < 97) || (input.charCodeAt(i) > 122))) {
                return false;
            }
        }
        return valid;
    }

    validMax(maxSize, input) {
        return input.length <= maxSize;
    }

    clearError(e) {
        const siblingNode = e.target.nextSibling;
        if (siblingNode !== null && siblingNode.nodeName === "P") {
            e.target.parentElement.removeChild(siblingNode);
            e.target.setAttribute("style", "border:default");
        }
    }

    validateName() {
        const fullNameInput = document.getElementById('full_name_input');
        const minRequired = this.validMin(fullNameInput.value);
        const charactersOnly = this.validChars(fullNameInput.value);
        const maximum = 50;
        const maxRequired = this.validMax(maximum, fullNameInput.value);
        const existingError = document.getElementById('nameError');
        if (!minRequired || !charactersOnly || !maxRequired) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 3 and maximum of 50 alphabet characters are allowed **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'nameError');
                fullNameInput.parentElement.insertBefore(error, fullNameInput.nextSibling);
                fullNameInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            fullNameInput.value = '';
        }
        else {
            if (existingError) {
                fullNameInput.parentElement.removeChild(existingError);
            }
            fullNameInput.setAttribute("style", "border:default");
            return fullNameInput.value;
        }
    }




    validateAddress() {
        const addressInput = document.getElementById('address_input');
        const minRequired = this.validMin(addressInput.value);
        const maximum = 100;
        const maxRequired = this.validMax(maximum, addressInput.value);
        const existingError = document.getElementById('addressError');
        if (!minRequired || !maxRequired) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 3 and maximum of 100 characters are allowed **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'addressError');

                addressInput.parentElement.insertBefore(error, addressInput.nextSibling);
                addressInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            addressInput.value = '';
        }
        else {
            if (existingError) {
                addressInput.parentElement.removeChild(existingError);
            }
            addressInput.setAttribute("style", "border:default");
            return addressInput.value;
        }
    }

    existingUsername() {
        const usernameInput = document.getElementById('username_input');
        const existingError = document.getElementById('usernameError');

        usernameInput.value = '';
        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = "** Username already exists **";
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'usernameError');
            usernameInput.parentElement.insertBefore(error, usernameInput.nextSibling);
            usernameInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
        }
        else {
            if (existingError) {
                usernameInput.parentElement.removeChild(existingError);
            }
            usernameInput.setAttribute("style", "border:default");
            return usernameInput.value;
        }

    }

    existingEmail() {
        const emailInput = document.getElementById('email_input');
        const existingError = document.getElementById('emailError');
        emailInput.value = '';

        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = "** Email already exists **";
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'emailError');
            emailInput.parentElement.insertBefore(error, emailInput.nextSibling);
            emailInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
        }
        else {
            if (existingError) {
                emailInput.parentElement.removeChild(existingError);
            }
            emailInput.setAttribute("style", "border:default");
            return emailInput.value;
        }


    }

    numbersOnly(input) {
        const size = input.length;
        for (let i = 0; i < size; ++i) {
            if (input.charAt(i) !== '-' && (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57)) {
                return false;
            }
        }
        return true;
    }

    validNumber(input) {
        const size = input.length, maxSize = 12;
        const firstHyphen = 3, secondHyphen = 7;
        return (size === maxSize && input.charAt(firstHyphen) === '-' && input.charAt(secondHyphen) === '-');
    }

    validatePhoneNumber() {
        const phoneNumberInput = document.getElementById('phone_number_input');
        const onlyNumbers = this.numbersOnly(phoneNumberInput.value);
        const valid = this.validNumber(phoneNumberInput.value);
        const existingError = document.getElementById('phoneError');

        if (!onlyNumbers || !valid) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Please enter a valid phone number ###-###-#### **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'phoneError');
                phoneNumberInput.parentElement.insertBefore(error, phoneNumberInput.nextSibling);
                phoneNumberInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            phoneNumberInput.value = '';
        }
        else {
            if (existingError) {
                phoneNumberInput.parentElement.removeChild(existingError);
            }
            phoneNumberInput.setAttribute("style", "border:default");
            return phoneNumberInput.value;
        }
    }

    alphaNumeric(input) {
        const size = input.length;
        const lowNumber = 48, highNumber = 57, lowUpperCase = 65, highUpperCase = 90, firstLowerCase = 97, lastLowerCase = 122;
        for (let i = 0; i < size; ++i) {
            if (input.charCodeAt(i) < lowNumber || (input.charCodeAt(i) > highNumber && input.charCodeAt(i) < lowUpperCase) || (input.charCodeAt(i) > highUpperCase && input.charCodeAt(i) < firstLowerCase) || (input.charCodeAt(i) > lastLowerCase)) {
                return false;
            }
        }
        return true;
    }

    validateUsername() {
        const usernameInput = document.getElementById('username_input');
        const maxSize = 30;
        const numericAlpha = this.alphaNumeric(usernameInput.value);
        const minRequired = this.validMin(usernameInput.value);
        const maxRequired = this.validMax(maxSize, usernameInput.value);
        const existingError = document.getElementById('usernameError');

        if (!numericAlpha || !minRequired || !maxRequired) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 3 and maximum of 30 alphanumeric characters are allowed **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'usernameError');
                usernameInput.parentElement.insertBefore(error, usernameInput.nextSibling);
                usernameInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            usernameInput.value = '';
        }
        else {
            if (existingError) {
                usernameInput.parentElement.removeChild(existingError);
            }
            usernameInput.setAttribute("style", "border:default");
            return usernameInput.value;
        }
    }

    validateEmail() {
        const emailInput = document.getElementById('email_input');
        const minEmail = emailInput.value.length >= 6;
        const maxSize = 50;
        const maxRequired = this.validMax(maxSize, emailInput.value);
        const existingError = document.getElementById('emailError');

        if (!minEmail || !maxRequired) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 10 and maximum up to 50 alphanumeric characters are allowed **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'emailError');
                emailInput.parentElement.insertBefore(error, emailInput.nextSibling);
                emailInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            emailInput.value = '';
        }
        else {
            if (existingError) {
                emailInput.parentElement.removeChild(existingError);
            }
            emailInput.setAttribute("style", "border:default");
            return emailInput.value;
        }
    }


    validatePassword() {
        const passwordInput = document.getElementById('password_input');
        const minPassword = (passwordInput.value.length >= 10), maxPassword = (passwordInput.value.length <= 60);
        const existingError = document.getElementById('passwordError');

        if (!minPassword || !maxPassword) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 10 and maximum of 60 characters **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'addressError');
                passwordInput.parentElement.insertBefore(error, passwordInput.nextSibling);
                passwordInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            passwordInput.value = '';
        }
        else {
            const existingError = document.getElementById('passwordError');
            if (existingError) {
                passwordInput.parentElement.removeChild(existingError);
            }
            passwordInput.setAttribute("style", "border:default");
            return passwordInput.value;
        }

    }
    validateConfirmedPassword(e) {
        const passwordInput = document.getElementById('password_input');
        const confirmedPasswordInput = document.getElementById('confirmed_password_input');
        const matched = confirmedPasswordInput.value.localeCompare(passwordInput.value);
        const existingError = document.getElementById('passwordError');

        if (matched) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Passwords must be matched **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'addressError');
                confirmedPasswordInput.parentElement.insertBefore(error, confirmedPasswordInput.nextSibling);
                confirmedPasswordInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            confirmedPasswordInput.value = '';
        }
        else {
            const existingError = document.getElementById('confirmedPasswordError');
            if (existingError) {
                confirmedPasswordInput.parentElement.removeChild(existingError);
            }
            confirmedPasswordInput.setAttribute("style", "border:default");
            return confirmedPasswordInput.value;
        }

    }
    register(e) {
        e.preventDefault();
        const fullName = this.validateName();
        const address = this.validateAddress();
        const phoneNumber = this.validatePhoneNumber();
        const username = this.validateUsername();
        const email = this.validateEmail();
        const password = this.validatePassword();
        const confirmed_password = this.validateConfirmedPassword();

        if (fullName && address && phoneNumber && username && email && password && confirmed_password) {
            const newUser = {
                fullName: fullName,
                address: address,
                phoneNumber: phoneNumber,
                username: username,
                email: email,
                password: password
            };

            axios.post("http://18.220.250.26:5010/register", newUser)
                .then(result => {
                    if (result.data.hasOwnProperty('username')) {
                        this.existingUsername();
                    }
                    else if (result.data.hasOwnProperty('email')) {
                        this.existingEmail();
                    }
                    this.props.updateAuth('', result.data.user_id);
                })
                .catch(error => {
                    if (error) throw error;
                });
        }


    }




    render() {
        return (
            <div>
                {this.props.current_user ?
                    <Redirect to="/login" />
                    :
                    <div className="text-center">
                        <form method="POST" onSubmit={this.register}>
                            <label>Full Name:</label>
                            <input type="text" name="full_name" id="full_name_input" onFocus={this.clearError} required></input>
                            <div>
                                <label>Address:</label>
                                <input type="text" name="address" id="address_input" onFocus={this.clearError} required ></input>
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input type="text" name="phone_number" id="phone_number_input" onFocus={this.clearError} required ></input>

                            </div>
                            <div>
                                <label>Username:</label>
                                <input type="text" name="username" id="username_input" onFocus={this.clearError} required></input>
                                <label>Email:</label>
                                <input type="email" name="email" id="email_input" onFocus={this.clearError} required></input>
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password" name="password" id="password_input" onFocus={this.clearError} required></input>
                                <label>Confirmed Password:</label>
                                <input type="password" name="confirmed_password" id="confirmed_password_input" onFocus={this.clearError} required ></input>
                            </div>
                            <button className="btn btn-primary" type="submit">Register</button>
                        </form>

                    </div>
                }
            </div>
        )
    }
}