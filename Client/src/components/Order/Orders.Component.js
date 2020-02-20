
import React from 'react';
import OrderItem from './OrderItem.Component';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Order extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            order_items: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.current_user !== '') {
            axios.get('http://18.220.250.26:5010/orders', {
                params:
                {
                    current_user: this.props.current_user,
                }
            })
                .then(result => {
                    this.setState({ order_items: result.data });
                })
                .catch(error => {
                    if (error) throw error;
                });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                {this.props.current_user !== '' ?
                    <div style={{ textAlign: 'center' }}>
                        <h3>Orders History</h3>
                        {this.state.order_items.map((item, index) =>
                            (
                                <OrderItem key={item.order_id}
                                    current_user={this.props.current_user}
                                    order_id={item.order_id}
                                    index={index}
                                    total={item.total}
                                />
                            ))
                        }
                    </div>
                    :
                    <Redirect to="/login" />
                }
            </div>
        )
    }
}