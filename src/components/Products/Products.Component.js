import React from 'react';
import Product from '../Products/Product.Component';
import axios from 'axios';
import './Products.css';
import Cookies from 'js-cookie';

export default class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_user: '',
            products: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000')
            .then(response => {
                this.setState({ products: response.data.map(product => product) })
            })
            .catch(error => {
                console.log(`error: ${error}`);
            })

    }

    render() {
        return (
            <div className="product-list">
                {this.state.products.map(product => (
                    <Product key={product.product_id}
                        id={product.product_id}
                        artist={product.artist_id}
                        title={product.product_title}
                        price={product.price}
                        image={product.image_path}
                    />
                ))}
            </div>
        );
    }
}
