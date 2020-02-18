import React from 'react';

export default class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.updateCart = this.updateCart.bind(this);
        this.deleteFromCart = this.deleteFromCart.bind(this);
    }

    updateCart(e) {
        e.preventDefault();
        const newQuantity = parseInt(e.target.quantity.value);
        const quantityLabel = document.getElementById('quantityLabel');
        const existingError = document.getElementById('quantityError');
        if (newQuantity < 1) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Quantity must be greater than 0 **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'quantityError');

                quantityLabel.parentElement.insertBefore(error, quantityLabel);
                quantityLabel.nextSibling.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
            e.target.value = '';
        }
        else {
            if (existingError) {
                quantityLabel.parentElement.removeChild(existingError);
            }
            quantityLabel.nextSibling.setAttribute("style", "border:default");
            this.props.updateQuantity(this.props.index, this.props.id, newQuantity);

        }
    }

    deleteFromCart(e) {
        e.preventDefault();
        this.props.deleteItem(this.props.id);
    }

    render() {
        return (
            <div className="product-list">
                <h3>{this.props.title}</h3>
                <h3>${this.props.price}</h3>
                <img src={`http://localhost:5000/imgs/${this.props.image}`} width="250px" height="250px" alt={this.props.title}></img>
                {this.props.updateQuantity !== '' ?
                    <div>
                        <form onSubmit={this.updateCart}>
                            <label id="quantityLabel">Quantity: </label>
                            <input type="number" name="quantity" placeholder={this.props.quantity}></input>
                            <p><button className="btn btn-success" type="submit">Update</button></p>

                        </form>

                        <form onSubmit={this.deleteFromCart}>
                            <p><button className="btn btn-danger" type="submit">Delete</button></p>
                        </form>

                    </div>
                    :
                    <h4>Quantity: {this.props.quantity}</h4>
                }
            </div>
        )
    }
}