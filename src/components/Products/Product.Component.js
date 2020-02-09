import React from 'react';
import { Link } from 'react-router-dom';

const Product = (props) => {
    return (
        <div class="product-detail">

            <div class="product-title">
                <h2>{props.title}</h2>
            </div>
            <div class="product-image">
                <Link to={`/product/${props.id}`}>
                    <img src={`http://localhost:5000/imgs/${props.image}`} width="250px" height="250px" alt={props.title}></img>
                </Link>

            </div>

            <div class="product-price">
                <p>${props.price}</p>
            </div>
        </div>
    )
}

export default Product;