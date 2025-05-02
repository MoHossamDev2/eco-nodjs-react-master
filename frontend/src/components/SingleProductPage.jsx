import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./SingleProductPage.css";
import Navbar from "./Navbar";

export default function SingleProductPage({
  currentUser,
  setFilteredProducts,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const activeUser = currentUser || storedUser;
  const userId = activeUser?.user?._id; // Get the user ID from currentUser or localStorage
  const [count, setCount] = useState(1);
  const [rating, setRating] = useState(0); // State to hold the current rating
  const [hoveredRating, setHoveredRating] = useState(0); // State to track hover

  const handlePushInCart = () => {
    if (!currentUser && !storedUser) {
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
        userID: userId,
        productID: id,
        count,
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

  const handleRating = (value) => {
    if(!storedUser||!currentUser){
      navigate('/signup');
      return ;
    }
    setRating(value); // Update the rating state

    // Send the rating to the backend
    fetch(`http://localhost:5000/product/rate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userId, // Pass the logged-in user's ID
        productID: id, // Pass the current product's ID
        rating: value, // Pass the selected rating value
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Rating Submitted",
            text: "Thank you for rating this product!",
            showConfirmButton: false,
            timer: 1500,
          });
          // Re-fetch the product to get updated ratings and average
          fetchProduct();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Failed to submit rating",
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

  const fetchProduct = () => {
    fetch(`http://localhost:5000/product/${id}?userID=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          // Check if the user has already rated this product and set the rating accordingly
          const userRating = data.product.rate.ratings.find(
            (rating) => rating?.userID === userId
          );
          setRating(userRating ? userRating?.rating : 0);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [id, userId]);

  const increaseCount = () => setCount(count + 1);
  const decreaseCount = () => setCount(count > 1 ? count - 1 : 1);

  if (isLoading) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar
        setFilteredProducts={setFilteredProducts}
        currentUser={currentUser}
      />
      <div>
        {product && (
          <div className="page-container">
            <div className="container1">
              <div className="card1">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/default-product-img.png";
                  }}
                />
              </div>
              <div className="card2">
                <h2>{product.name}</h2>
                <h3>${product.price}</h3>
                <h4>{product.stock} in stock</h4>
                <p>{product.description}</p>

                {/* Rating Component */}
                <h4>Rate this Product</h4>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style={{
                        width: "32px",
                        height: "32px",
                        stroke: "black",
                        strokeWidth: "1px",
                        fill:
                          star <= (hoveredRating || rating) ? "gold" : "#ccc",
                        cursor: "pointer",
                        transition: "fill 0.3s",
                      }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRating(star)}
                    >
                      <path d="M12 17.27L18.18 21 15.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 8.46 13.97 5.82 21z" />
                    </svg>
                  ))}
                </div>

                <div className="quantity-controls">
                  <i className="fa-solid fa-minus" onClick={decreaseCount}></i>
                  <strong>{count}</strong>
                  <i className="fa-solid fa-plus" onClick={increaseCount}></i>
                </div>
                <button onClick={handlePushInCart}>
                  <i className="fa-solid fa-bag-shopping"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
