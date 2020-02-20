import React from 'react';
import { Link } from 'react-router-dom';

const Product = (props) => {
    return (
        <div className="product-detail">
            <div className="product-title">
                <h2>{props.title}</h2>
            </div>
            <div className="product-image">
                <Link to={`/product/${props.id}`}>
                    <img src={`http://18.220.250.26:5010/imgs/${props.image}`} width="250px" height="250px" alt={props.title}></img>
                </Link>
            </div>
            <div className="product-price">
                <p>${props.price}</p>
            </div>
        </div>
    )
}

export default Product;