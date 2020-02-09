
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
    }

    register(e) {
        e.preventDefault();
        const fullName = document.getElementById('full_name_input').value;
        const address = document.getElementById('address_input').value;
        const phoneNumber = document.getElementById('phone_number_input').value;
        const username = document.getElementById('username_input').value;
        const email = document.getElementById('email_input').value;
        const password = document.getElementById('password_input').value;
        const confirmedPassword = document.getElementById('confirmed_password_input').value;
        const newUser = {
            fullName: fullName,
            address: address,
            phoneNumber: phoneNumber,
            username: username,
            email: email,
            password: password
        };

        axios.post("http://localhost:5000/register", newUser)
            .then(result => {
                console.log(`result: ${result.data.user_id}`);
                this.props.updateAuth(null, result.data.user_id);
                console.log(`props current user: ${this.props.current_user}`);
            })
            .catch(error => {
                if (error) throw error;
            });
    }

    render() {
        return (
            <div>
                {this.props.current_user ?
                    <Redirect to="/login" />
                    :
                    <form method="POST" onSubmit={this.register}>
                        <label>Full Name:</label>
                        <input type="text" name="full_name" id="full_name_input"></input>
                        <div>
                            <label>Address:</label>
                            <input type="text" name="address" id="address_input"></input>
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input type="text" name="phone_number" id="phone_number_input"></input>
                        </div>
                        <div>
                            <label>Username:</label>
                            <input type="text" name="username" id="username_input"></input>
                            <label>Email:</label>
                            <input type="email" name="email" id="email_input"></input>
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" id="password_input"></input>
                            <label>Confirmed Password:</label>
                            <input type="password" name="confirmed_password" id="confirmed_password_input"></input>
                        </div>
                        <button type="submit">Register</button>

                    </form>
                }
            </div>

        )
    }
}