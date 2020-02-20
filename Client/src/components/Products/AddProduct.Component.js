import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productImage: '',
            redirectToHome: false
        }
        this.onFileChange = this.onFileChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateImage = this.validateImage.bind(this);
        this.validatePrice = this.validatePrice.bind(this);
        this.uploadedError = this.uploadedError.bind(this);
    }

    clearError(e) {
        e.target.setAttribute("style", "border:default");
    }


    onFileChange(e) {
        this.setState({ productImage: e.target.files[0] });
    }

    validateTitle() {
        const titleLabel = document.getElementById('titleLabel');
        const titleInput = document.getElementById('title_input');
        let existingError = document.getElementById('titleError');

        const min = 3, maxSize = 100;


        if (titleInput.value.length < min || titleInput.value.length > maxSize) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Minimum of 3 and maximum of 100 alphanumeric characters are allowed **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'titleError');
                titleLabel.parentElement.insertBefore(error, titleLabel);
                titleInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
        }
        else {
            if (existingError) {
                titleLabel.parentElement.removeChild(existingError);
            }
            titleInput.setAttribute("style", "border:default");
            return titleInput.value;

        }

    }

    validatePrice() {
        const priceLabel = document.getElementById('priceLabel');
        const priceInput = document.getElementById('price_input');
        let existingError = document.getElementById('priceError');

        const min = 1;


        if (priceInput.value < min) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Price must be at least $1 **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'priceError');
                priceLabel.parentElement.insertBefore(error, priceLabel);
                priceInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
        }
        else {
            if (existingError) {
                priceLabel.parentElement.removeChild(existingError);
            }
            priceInput.setAttribute("style", "border:default");
            return priceInput.value;
        }

    }

    validateImage() {

        const imageLabel = document.getElementById('imageLabel');
        const imageInput = document.getElementById('image_input');
        const uploaded = imageInput.files.length;
        let existingError = document.getElementById('imageError');

        if (uploaded === 0) {
            if (!existingError) {
                let error = document.createElement("p");
                error.innerHTML = "** Please upload an image **";
                error.setAttribute('style', 'color: red');
                error.setAttribute('id', 'imageError');
                imageLabel.parentElement.insertBefore(error, imageLabel);
                imageInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
            }
        }
        else {
            if (existingError) {
                imageLabel.parentElement.removeChild(existingError);
            }
            imageInput.setAttribute("style", "border:default");
            return this.state.productImage;
        }
    }

    uploadedError(errorMessage) {
        const imageLabel = document.getElementById('imageLabel');
        const imageInput = document.getElementById('image_input');
        let existingError = document.getElementById('imageError');

        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = `** ${errorMessage} ** `;
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'imageError');
            imageLabel.parentElement.insertBefore(error, imageLabel);
            imageInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
        }
        else {
            if (existingError) {
                imageLabel.parentElement.removeChild(existingError);
            }
            imageInput.setAttribute("style", "border:default");
            return this.state.productImage;
        }
    }

    existingProduct(errorMessage) {
        const titleInput = document.getElementById('title_input');
        const existingError = document.getElementById('titleError');
        titleInput.value = '';

        if (!existingError) {
            let error = document.createElement("p");
            error.innerHTML = errorMessage;
            error.setAttribute('style', 'color: red');
            error.setAttribute('id', 'titleError');
            titleInput.parentElement.insertBefore(error, titleInput.nextSibling);
            titleInput.setAttribute("style", "border: 1px solid red; box-shadow: 0 0 10px rgb(255, 0, 0)");
        }
        else {
            if (existingError) {
                titleInput.parentElement.removeChild(existingError);
            }
            titleInput.setAttribute("style", "border:default");
            return titleInput.value;
        }

    }

    onFormSubmit(e) {
        e.preventDefault();
        const title = this.validateTitle();

        const price = this.validatePrice();

        const productImage = this.validateImage();

        if (title && price && productImage) {
            const formData = new FormData();
            formData.append('productImage', productImage);
            formData.append('artist_id', this.props.current_user);
            formData.append('title', title);
            formData.append('price', price);

            axios.post('http://<aws-public-ip>:port/add-product', formData)
                .then(result => {
                    if (result.data.hasOwnProperty('error')) {
                        this.uploadedError(result.data.error);
                    }
                    else if (result.data.hasOwnProperty('title')) {
                        this.existingProduct(result.data.title);
                    }
                    else {
                        this.setState({ redirectToHome: true });
                    }
                })
                .catch(error => {
                    if (error) throw error;
                })
        }

    }

    render() {
        return (
            <div>
                {this.state.redirectToHome ?
                    <Redirect to="/" />
                    :
                    this.props.current_user !== '' && this.props.token !== '' ?
                        <div className="add-product-form">
                            <form method="POST" encType="multipart/form-data" onSubmit={this.onFormSubmit}>
                                <label id="titleLabel">Title:</label>
                                <input type="text" name="title" id="title_input" onFocus={this.clearError}></input>
                                <div>
                                    <label id="priceLabel">Price:</label>
                                    <input type="number" name="price" id="price_input" onFocus={this.clearError}></input>
                                </div>
                                <div>
                                    <label id="imageLabel">Image:</label>
                                    <input type="file" name="image" id="image_input" onFocus={this.clearError} onChange={this.onFileChange}></input>
                                </div>
                                <button className="btn btn-success" type="submit">Submit</button>
                            </form>

                        </div>
                        :
                        <Redirect to="/login" />
                }
            </div>
        )
    }
}
