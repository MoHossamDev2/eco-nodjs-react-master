import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./ProductCard.css";
import SvgRating from "./SvgRating";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  const handlePushInCart = () => {
    if (!storedUser) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "please sign up first",
      });
      return;
    }
    fetch(`http://localhost:5000/pushInCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: storedUser?.user._id,
        productID: product._id,
        count: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Product Added",
            text: "The product has been added to your cart!",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Failed to add product to cart",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again.",
        });
      });
  };

  const handleDeleteProduct = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/product/${product._id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire("Deleted!", "The product has been deleted.", "success");
            } else {
              Swal.fire(
                "Error!",
                data.message || "Failed to delete product.",
                "error"
              );
            }
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "An error occurred. Please try again.",
              "error"
            );
          });
      }
    });
  };

  const handleEditProduct = (e) => {
    e.stopPropagation();
    navigate(`/editProduct/${product._id}`);
  };

  return (
    <div
      className="card"
      onClick={() => {
        if (storedUser?.user.isAdmin !== true)
          navigate(`/product/${product._id}`);
      }}
    >
      <img
        src={product.image}
        className="card-img"
        alt={product.name}
        onError={(e) => {
          e.target.src = "/default-product-img.png";
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: "5px",
          }}
        >
          <h3>{product.price}</h3>
          <h5>$</h5>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SvgRating value={product.rate?.average} />
          <h6>by {product.rate?.usersCount} users</h6>
        </div>

        <div className="card-button-container">
          {storedUser?.user.isAdmin ? (
            <>
              <button
                className="card-button delete-button"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
              <button
                className="card-button edit-button"
                onClick={handleEditProduct}
              >
                Edit Product
              </button>
            </>
          ) : (
            <button
              className="card-button"
              onClick={(e) => {
                e.stopPropagation();
                handlePushInCart();
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
