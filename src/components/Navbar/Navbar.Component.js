import React, { Component } from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import Products from '../Products/Products.Component';
import ProductDetail from '../Products/ProductDetail.Component';
import AddProduct from '../Products/AddProduct.Component';
import Login from '../Authentication/Login.Component';
import Register from '../Authentication/Register.Component';
import Logout from '../Authentication/Logout.Component';
import './Navbar.css';
import Cookie from 'js-cookie';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            current_user: null
        }

        this.updateAuth = this.updateAuth.bind(this);
        this.clearAuth = this.clearAuth.bind(this);
    }

    clearAuth() {
        this.setState({ token: undefined, current_user: undefined });
    }

    updateAuth(token, current_user) {
        this.setState({ token: token, current_user: current_user });
    }

    render() {
        return (
            <div>
                {
                    <header className="main-header">
                        <nav className="main-header__nav">
                            <ul className="main-header__ul">
                                <li className="main-header__li"><Link to="/">Home</Link></li>
                                <li className="main-header__li"><Link to="/add-product">Add Product</Link></li>
                                {this.state.current_user === null || this.state.token === null ?
                                    [
                                        <li key={"login"} className="main-header__li"><Link to="/login">Login</Link></li>,
                                        <li key={"register"} className="main-header__li"><Link to="/register">Register</Link></li>
                                    ]

                                    :
                                    <li className="main-header__li"><Link to="/logout">Logout</Link></li>
                                }
                                <li className="main-header__li"><Link to="/cart">Cart</Link></li>
                                <li className="main-header__li"><Link to="/order">Orders</Link></li>
                            </ul>
                            <Route path="/login" render={() =>
                                <Login token={this.state.token} current_user={this.state.current_user} updateAuth={this.updateAuth} />
                            } />
                            <Route path="/logout" render={() =>
                                <Logout current_user={this.state.current_user} updateAuth={this.updateAuth} />
                            } />

                            <Route path="/register" render={() =>
                                <Register current_user={this.state.current_user} updateAuth={this.updateAuth} />
                            } />

                            <Route path="/add-product" render={() =>
                                <AddProduct current_user={this.state.current_user} />
                            } />


                        </nav>
                    </header>
                }
            </div>
        );
    }
}