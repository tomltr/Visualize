import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.Component';
import Products from './components/Products/Products.Component';
import Carts from './components/Cart/Carts.Component';
import Orders from './components/Order/Orders.Component';

import './App.css';
import ProductDetail from './components/Products/ProductDetail.Component';

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Carts} />
      <Route path="/order" component={Orders} />

    </Router>

  );
}

export default App;
