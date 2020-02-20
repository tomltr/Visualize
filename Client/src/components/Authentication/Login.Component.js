import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.submitLogin = this.submitLogin.bind(this);
        this.userNotExists = this.userNotExists.bind(this);
        this.invalidLogin = this.invalidLogin.bind(this);
    }

    submitLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username_input').value;
        const password = document.getElementById('password_input').value;
        axios.post('http://<aws-public-ip>:port/login',
            {
                username: username,
                password: password
            }
        )
            .then(result => {
                if (result.data.hasOwnProperty('user_error')) {
                    console.log('user not exists');
                    this.userNotExists();
                }
                else if (result.data.hasOwnProperty('error')) {
                    console.log('invalid login');
                    this.invalidLogin();
                }
                else {
                    const result_token = result.data.token;
                    const result_id = result.data.user_id;
                    this.props.updateAuth(result_token, result_id);
                }

            })
            .catch(error => {
                if (error) throw error;
            });
    }

    userNotExists() {
        const usernameInput = document.getElementById('usernameLabel');
        let existingError = document.getElementById('usernameError');
        usernameInput.nextSibling.value = '';

        if (existingError) {
            usernameInput.parentElement.removeChild(existingError);
            existingError = null;
        }

        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = "** Username does not exists **";
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'usernameError');
            usernameInput.parentElement.insertBefore(error, usernameInput);
        }
    }

    invalidLogin() {
        const usernameInput = document.getElementById('usernameLabel');
        let existingError = document.getElementById('usernameError');
        const passwordInput = document.getElementById('password_input');
        passwordInput.value = ''

        if (existingError) {
            usernameInput.parentElement.removeChild(existingError);
            existingError = null;
        }

        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = "** Invalid username/password **";
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'usernameError');
            usernameInput.parentElement.insertBefore(error, usernameInput);
        }

    }

    render() {
        return (
            <div className="product-list">
                {this.props.current_user !== '' && this.props.token !== '' ?
                    <Redirect to="/" />
                    :
                    <form method="POST" onSubmit={this.submitLogin}>
                        <label id="usernameLabel">UserName:</label>
                        <input type="text" name="username" id="username_input" required ></input>
                        <p><label>Password:</label>
                            <input type="password" name="password" id="password_input" required ></input>
                        </p>
                        <button className="btn btn-success" type="submit">Log In</button>
                    </form>
                }
            </div>
        )
    }
}
