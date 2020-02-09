import React from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Cookie from 'js-cookie';
import Products from '../Products/Products.Component';
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentDidMount() {
    }

    submitLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username_input').value;
        const password = document.getElementById('password_input').value;
        axios.post('http://localhost:5000/login',
            {
                username: username,
                password: password
            }
        )
            .then(result => {
                const result_token = result.data.token;
                const result_id = result.data.user_id;
                this.props.updateAuth(result_token, result_id);

            })
            .catch(error => {
                if (error) throw error;
            });


    }

    render() {
        return (

            <div>
                {this.props.current_user !== null && this.props.token !== null ?
                    <Redirect to="/" />
                    :

                    <form method="POST" onSubmit={this.submitLogin}>
                        <label>UserName:</label>
                        <input type="text" name="username" id="username_input"></input>
                        <label>Password:</label>
                        <input type="password" name="password" id="password_input"></input>
                        <button type="submit">Log In</button>
                    </form>
                }

            </div>

        )
    }

}