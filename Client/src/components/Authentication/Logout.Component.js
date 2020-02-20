import React from 'react';
import { Redirect } from 'react-router';
export default class Logout extends React.Component {
    componentDidMount() {
        this.props.clearAuth();
        this.props.clearCart();
    }

    render() {
        return (
            <Redirect to="/" />
        )
    }
}
