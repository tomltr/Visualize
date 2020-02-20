import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar/Navbar.Component';
import Products from '../src/components/Products/Products.Component';
import Order from '../src/components/Order/Orders.Component';
import OrderForm from '../src/components/Order/OrderForm.Component';
import ProductDetail from '../src/components/Products/ProductDetail.Component';
import AddProduct from '../src/components/Products/AddProduct.Component';
import Login from '../src/components/Authentication/Login.Component';
import Register from '../src/components/Authentication/Register.Component';
import Logout from '../src/components/Authentication/Logout.Component';
import Cart from '../src/components/Cart/Cart.Component';
import axios from 'axios';

import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: '',
      current_user: '',
      cart_id: '',
      order_id: ''
    }
    this.updateAuth = this.updateAuth.bind(this);
    this.clearAuth = this.clearAuth.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.updateCartId = this.updateCartId.bind(this);
    this.updateOrderId = this.updateOrderId.bind(this);
  }

  clearAuth() {
    this.setState({ token: '', current_user: '' });
  }

  clearCart() {
    this.setState({ cart_id: '' });
  }

  updateAuth(token, current_user) {
    this.setState({ token: token, current_user: current_user });
  }

  updateCartId(current_cart_id) {
    this.setState({ cart_id: current_cart_id });
  }

  updateOrderId(current_order_id) {
    this.setState({ order_id: current_order_id });
  }

  addToCart(event, product_id, product_title) {
    event.preventDefault();
    alert(`${product_title} added to cart`);
    axios.post(`http://<aws-public-ip>:port/add-to-cart`,
      {
        token: this.state.token,
        cart_id: this.state.cart_id,
        current_user: this.state.current_user,
        product_id: product_id
      })
      .then(response => {
        this.setState({ cart_id: response.data });
      })
      .catch(error => {
        if (error) throw error;
      });
  }


  render() {
    return (
      <Router>
        <Navbar token={this.state.token} current_user={this.state.current_user} />
        <Route path="/" exact component={Products} />
        <Route path="/login" render={() =>
          <Login token={this.state.token} current_user={this.state.current_user} updateAuth={this.updateAuth} />
        } />
        <Route path="/logout" render={() =>
          <Logout token={this.state.token} current_user={this.state.current_user} clearAuth={this.clearAuth} clearCart={this.clearCart} />
        } />

        <Route path="/register" render={() =>
          <Register current_user={this.state.current_user} token={this.state.token} updateAuth={this.updateAuth} />
        } />

        <Route path="/add-product" render={() =>
          <AddProduct current_user={this.state.current_user} token={this.state.token} />
        } />

        <Route path="/cart" render={() =>
          <Cart token={this.state.token} current_user={this.state.current_user} cart_id={this.state.cart_id} updateCartId={this.updateCartId} />
        } />

        <Route path="/add-to-cart"
          render={() => <Cart token={this.state.token} current_user={this.state.current_user} cart_id={this.state.cart_id} updateCartId={this.updateCartId} />}
        />

        <Route path="/order-form"
          render={() => <OrderForm token={this.state.token} current_user={this.state.current_user} cart_id={this.state.cart_id} clearCart={this.clearCart} />}
        />

        <Route path="/product/:id"
          render={props => <ProductDetail token={this.state.token} current_user={this.state.current_user} addToCart={this.addToCart} {...props} />}
        />

        <Route path="/order"
          render={props => <Order current_user={this.state.current_user} token={this.state.token} {...props} />}
        />

      </Router>
    );
  }
}


