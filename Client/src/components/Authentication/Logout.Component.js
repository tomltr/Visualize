import React from 'react';
import { Redirect } from 'react-router';
export default class Logout extends React.Component {
    _isMounted = false;
    componentDidMount() {
        this._isMounted = true;
        this.props.clearAuth();
        this.props.clearCart();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <Redirect to="/" />
        )
    }
}