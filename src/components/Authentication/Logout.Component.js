import React from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Cookie from 'js-cookie';
import Products from '../Products/Products.Component';
import axios from 'axios';

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        // this.props.updateUser(undefined);

    }
    componentDidMount() {

        this.props.updateAuth(null, null);
    }

    render() {
        return (
            <Redirect to="/" />

        )
    }

}