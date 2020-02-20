import React from 'react';
import CartItem from '../Cart/CartItem.Component';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class OrderForm extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            cart_items: [],
            total: 0,
            redirectToOrders: false,
        }
        this.onSubmitOrderForm = this.onSubmitOrderForm.bind(this);
        this.numbersOnly = this.numbersOnly.bind(this);
        this.maxCreditNumberSize = this.maxCreditNumberSize.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.current_user !== '') {
            axios.get('http://<aws-public-ip>:port/cart', {
                params:
                {
                    current_user: this.props.current_user,
                    cart_id: this.props.cart_id
                }
            })
                .then(result => {
                    this.setState({ cart_items: result.data.cart_items, total: parseFloat(result.data.total).toFixed(2) });
                })
                .catch(error => {
                    if (error) throw error;
                });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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

    maxCreditNumberSize(input) {
        return input.length >= 10 && input.length <= 19;
    }

    validateCreditCard() {
        const creditCard = document.getElementById('creditCardNumber');

        const validCreditCard = this.numbersOnly(creditCard.value);
        const validSize = this.maxCreditNumberSize(creditCard.value);

        const existingError = document.getElementById('creditCardError');

        const totalHeader = document.getElementById('totalHeader');

        if (!validCreditCard || !validSize) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Please enter a valid credit card number **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'creditCardError');

                totalHeader.parentElement.insertBefore(error, totalHeader.nextSibling);
                creditCard.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");

            }
            creditCard.value = '';
        }
        else {
            if (existingError) {
                totalHeader.parentElement.removeChild(existingError);
            }
            creditCard.setAttribute("style", "border:default");
            return creditCard.value;
        }

    }

    onSubmitOrderForm(e) {
        e.preventDefault();
        const currentUser = this.props.current_user;
        const paymentMethod = document.getElementById('paymentMethod');
        const creditCardNumber = this.validateCreditCard();
        const total = this.state.total;
        const cartId = this.props.cart_id;

        if (creditCardNumber) {
            axios.post('http://<aws-public-ip>:port/order_form', {
                user: currentUser,
                payment_method: paymentMethod.value,
                credit_card_number: creditCardNumber,
                total: total,
                cart_id: cartId
            })
                .then(result => {
                    this.setState({ redirectToOrders: true });
                    this.props.clearCart();
                    alert(`${result.data}`);
                })
                .catch(error => {
                    if (error) throw error;
                });
        }

    }

    render() {
        return (
            <div>
                {!this.state.redirectToOrders ?
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
                                        index={index}
                                        title={item.product_title}
                                        price={item.price}
                                        image={item.image_path}
                                        quantity={item.quantity}
                                        updateQuantity={''}
                                    />
                                ))
                            }
                            <h3 id="totalHeader">Total: ${parseFloat(this.state.total).toFixed(2)}</h3>
                            <form onSubmit={this.onSubmitOrderForm}>
                                <select name="paymentMethod" id="paymentMethod">
                                    <option>Visa</option>
                                    <option>Amex</option>
                                    <option>MasterCard</option>
                                </select>
                                <label>Credit Card Number:</label>
                                <input type="text" name="creditCardNumber" id="creditCardNumber"></input>
                                <p><button className="btn btn-info" type="submit">Submit Order</button></p>
                            </form>
                        </div>
                    :
                    <Redirect to="/order" />
                }
            </div>
        )
    }
}
