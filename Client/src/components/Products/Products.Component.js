import React from 'react';
import Product from '../Products/Product.Component';
import axios from 'axios';
import './Products.css';

export default class Products extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            current_user: '',
            products: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('http://<aws-public-ip>:port/products')
            .then(response => {
                this.setState({ products: response.data.map(product => product) })
            })
            .catch(error => {
                console.log(`error: ${error}`);
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                <footer>** All images are from <em>Pixabay</em> **</footer>
            </div>
        );
    }
}
