import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./addProduct.css";

const EditProduct = ({ currentUser }) => {
  const { productId } = useParams(); // Extract productId from the URL
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const activeUser = currentUser || storedUser;
  const isAdmin = activeUser?.user?.isAdmin;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isValid, setIsValid] = useState(true);

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const product = await response.json();
        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setDescription(product.description);
        setImage(product.image);
        setCategory(product.category || "");
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      setErrorMessage("Name cannot be empty");
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

    const updatedProduct = { name, price, stock, description, image, category };

    try {
      const response = await fetch(
        `http://localhost:5000/editProduct/${productId}`, // Changed to PATCH
        {
          method: "PATCH", // Changed to PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setSuccessMessage("The product has been updated successfully!");
      setErrorMessage("");
      setIsValid(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update product");
      setIsValid(false);
    }
  };

  return (
    <div>
      {isAdmin ? (
        <div className="add-product-container">
          <h2 className="add-product-title">Edit Product</h2>
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
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
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
              Update Product
            </button>
            {!isValid && (
              <p className="error-message" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="success-message" style={{ color: "green" }}>
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

export default EditProduct;
