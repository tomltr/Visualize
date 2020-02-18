import React from 'react';
import axios from 'axios';
import './Products.css';

export default class ProductDetail extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            product_id: props.match.params.id,
            artist: '',
            title: '',
            image: '',
            price: '',
            date_created: '',

        }
        this.addToCart = this.addToCart.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get(`http://localhost:5000/product/` + this.state.product_id)
            .then(response => {
                const product = response.data[0];
                this.setState({ artist: product.username, title: product.product_title, image: product.image_path, price: product.price, date_created: product.date_created });
            })
            .catch(error => {
                console.log(`error: ${error}`);
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    addToCart(e) {
        this.props.addToCart(e, this.state.product_id, this.state.title);
    }

    render() {
        return (
            <div className="product-list">
                <h2>{this.state.title}</h2>
                <p><em>by {this.state.artist}</em></p>
                <img src={`http://localhost:5000/imgs/${this.state.image}`} width="250px" height="250px" alt={this.state.title}></img>
                <p>${this.state.price}</p>
                <p>Created: {this.state.date_created.split('T')[0]}</p>

                {this.props.current_user === '' ?
                    <form action="/login">
                        <button type="submit">Add to Cart</button>
                    </form>
                    :
                    <form onSubmit={this.addToCart}>

                        <button className="btn btn-info" type="submit">Add To Cart</button>
                    </form>
                }
            </div>
        );
    }
}