import React from 'react';
import axios from 'axios';

export default class OrderItem extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            order_items: [],
            showDetails: false
        }
        this.toggleShowDetails = this.toggleShowDetails.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get(`http://localhost:5000/order/${this.props.order_id}`)
            .then(result => {
                this.setState({ order_items: result.data });
            })
    }

    toggleShowDetails() {
        this.setState({ showDetails: !this.state.showDetails });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                {!this.state.showDetails ?
                    <div className="order-list">
                        <h3>Order Id: {this.props.order_id}</h3>
                        <h3>Total: ${this.props.total}</h3>
                    </div>
                    :

                    <div>
                        <div className="order-list">
                            <h3>Order Id: {this.props.order_id}</h3>
                            {this.state.order_items.map(item => (
                                <div key={item.order_item_id}>
                                    <h2>{item.product_title}</h2>
                                    <img src={`http://localhost:5000/imgs/${item.image_path}`} width="250px" height="250px" alt={item.product_title}></img>
                                    <h3>Price: ${item.price}</h3>
                                    <h4>Quantity: {item.quantity}</h4>
                                    <h5>Status: {item.status}</h5>
                                </div>
                            ))}
                            <h3>Total: ${this.props.total}</h3>
                        </div>
                    </div>
                }
                <button onClick={this.toggleShowDetails}>Show Details</button>
            </div >
        )
    }
}