import React, { useState } from "react";
import "./addProduct.css";

const AddProduct = ({ currentUser }) => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const activeUser = currentUser || storedUser;
    const isAdmin = activeUser.user.isAdmin;

    const [name, setName] = useState("");
    const [price, setPrice] = useState();
    const [stock, setStock] = useState(1);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message
    const [isValid, setIsValid] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            setErrorMessage("Name cannot be empty");
            setIsValid(false);
            return;
        }

        if (isNaN(price)) {
            setErrorMessage("Price must be Number");
            setIsValid(false);
            return;
        }

        if (price <= 0) {
            setErrorMessage("Price must be greater than 0");
            setIsValid(false);
            return;
        }
        if (stock <= 0) {
            setErrorMessage("Stock must be greater than 0");
            setIsValid(false);
            return;
        }
        if (description.trim() === "") {
            setErrorMessage("Description cannot be empty");
            setIsValid(false);
            return;
        }
        if (image.trim() === "") {
            setErrorMessage("Image URL cannot be empty");
            setIsValid(false);
            return;
        }

        const product = { name, price, stock, description, image, category };
        try {
            await fetch("https://backend-kappa-seven-10.vercel.app/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            setName("");
            setPrice(0);
            setStock(1);
            setDescription("");
            setImage("");
            setCategory("");
            setIsValid(true);
            setErrorMessage("");
            setSuccessMessage("The product has been added successfully!"); // Set success message
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to add product");
            setIsValid(false);
        }
    };

    return (
        <div>
            {isAdmin ? (
                <div className="add-product-container">
                    <h2 className="add-product-title">Add Product</h2>
                    <form className="add-product-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (isNaN(value) || value.trim() === "") {
                                        setErrorMessage("Invalid input: Price must be a numeric value");
                                        setIsValid(false);
                                    } else {
                                        setPrice(value);
                                        setErrorMessage("");
                                        setIsValid(true);
                                    }
                                }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock:</label>
                            <input
                                className="form-input"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description:</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category:</label>
                            <input
                                className="form-input"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                        <button className="form-submit-button" type="submit">
                            Add Product
                        </button>
                        {!isValid && (
                            <p className="error-message-addProduct" style={{ color: "red" }}>
                                {errorMessage}
                            </p>
                        )}
                        {successMessage && (
                            <p className="success-message-addProduct" style={{ color: "green" }}>
                                {successMessage}
                            </p>
                        )}
                    </form>
                </div>
            ) : (
                <div>You have no access</div>
            )}
        </div>
    );
};

export default AddProduct;
