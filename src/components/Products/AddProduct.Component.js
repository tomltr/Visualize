
import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productImage: ''
        }
        this.onFileChange = this.onFileChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFileChange(e) {
        this.setState({ productImage: e.target.files[0] });
    }

    onFormSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('title_input');
        const price = document.getElementById('price_input');
        const formData = new FormData();
        formData.append('productImage', this.state.productImage);
        formData.append('artist_id', this.props.current_user);
        formData.append('title', title.value);
        formData.append('price', price.value);

        axios.post('http://localhost:5000/add-product', formData)
            .then(result => {

            })
            .catch(error => {
                if (error) throw error;
            })
    }

    render() {
        return (
            <div>
                {this.props.current_user ?
                    <form method="POST" encType="multipart/form-data" onSubmit={this.onFormSubmit}>
                        <label>Title:</label>
                        <input type="text" name="title" id="title_input"></input>
                        <label>Price:</label>
                        <input type="number" name="price" id="price_input"></input>
                        <div>
                            <label>Image:</label>
                            <input type="file" name="image" id="image_input" onChange={this.onFileChange}></input>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                    :
                    <Redirect to="/login" />
                }

            </div>
        )
    }
}
