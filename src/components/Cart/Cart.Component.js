import React from 'react';
import CartItem from './CartItem.Component';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import './Cart.css';

export default class Cart extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            cart_items: [],
            total: 0
        }
        this.updateQuantity = this.updateQuantity.bind(this);
        this.updateTotal = this.updateTotal.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.current_user !== '') {
            axios.get('http://localhost:5000/cart', {
                params:
                {
                    current_user: this.props.current_user,
                    cart_id: this.props.cart_id
                }
            })
                .then(result => {
                    this.setState({ cart_items: result.data.cart_items, total: parseFloat(result.data.total).toFixed(2) });
                    this.props.updateCartId(result.data.cart_id);
                })
                .catch(error => {
                    if (error) throw error;
                });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateTotal() {
        let newTotal = 0;
        for (let i = 0; i < this.state.cart_items.length; ++i) {
            newTotal += this.state.cart_items[i].price * this.state.cart_items[i].quantity;
        }
        this.setState({ total: parseFloat(newTotal).toFixed(2) });
    }

    updateQuantity(index, cart_item_id, newQuantity) {
        const product_id = this.state.cart_items[index].product_id;
        axios.post('http://localhost:5000/cart', {
            product_id: product_id,
            cart_item_id: cart_item_id,
            cart_item_quantity: newQuantity,
            cart_id: this.props.cart_id
        })
            .then(result => {
                let newCartItem = this.state.cart_items[index];
                newCartItem.quantity = newQuantity;

                let newCartList = this.state.cart_items;
                newCartList.splice(index, 1, newCartItem);

                this.setState({ cart_items: newCartList });
                this.updateTotal();
            })
            .catch(error => {
                if (error) {
                    throw error;
                };
            });

    }

    deleteItem(cart_item_id) {
        axios.post(`http://localhost:5000/delete-cart-item/${cart_item_id}`)
            .then(result => {
                this.setState({ cart_items: this.state.cart_items.filter(item => item.cart_item_id !== cart_item_id) });
                this.updateTotal();
                alert(`${result.data}`);
            })
    }

    render() {
        return (
            <div>
                {this.props.current_user !== '' ?
                    this.state.total === '0.00' ?
                        <div style={{ textAlign: 'center' }}>
                            <h3>Empty Cart</h3>
                            <h5>Total: ${parseFloat(this.state.total).toFixed(2)}</h5>
                        </div>
                        :
                        <div className="product-list">
                            {this.state.cart_items.map((item, index) =>
                                (
                                    <CartItem key={item.cart_item_id}
                                        id={item.cart_item_id}
                                        index={index}
                                        title={item.product_title}
                                        price={item.price}
                                        image={item.image_path}
                                        quantity={item.quantity}
                                        updateQuantity={this.updateQuantity}
                                        deleteItem={this.deleteItem}
                                    />
                                ))
                            }
                            <h3>Total: ${parseFloat(this.state.total).toFixed(2)}</h3>
                            <Link to="/order-form"><button className="btn btn-primary">Checkout</button></Link>
                        </div>
                    :
                    <Redirect to="/login" />
                }
            </div>
        )
    }
}