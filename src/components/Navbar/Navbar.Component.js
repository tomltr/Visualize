import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
export default class Navbar extends Component {

    render() {
        return (
            <div>
                {
                    <header className="main-header">
                        <nav className="main-header__nav">
                            <ul className="main-header__ul">
                                <li className="main-header__li"><Link to="/">Home</Link></li>
                                <li className="main-header__li"><Link to="/add-product">Add Product</Link></li>
                                {(this.props.current_user === '' || this.props.token === '') ?
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
                        </nav>
                    </header>
                }
            </div>
        );
    }
}