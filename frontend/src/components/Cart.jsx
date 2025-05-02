import React, { useEffect, useState } from "react";
import "./Cart.css";
import SvgRating from "./SvgRating";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = storedUser?.user._id;

  const api_url = "http://localhost:5000/allProducts";
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch(api_url)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  // Fetch the cart items from the backend
  const fetchCartItems = async () => {
    if (!userId) {
      console.error("No userID found in localStorage");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/getCart/${userId}`);

      // Check if the response is OK
      if (!response.ok) {
        console.error(
          "Failed to fetch cart:",
          response.status,
          response.statusText
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Create a Map for faster lookups of products by productID
        const productMap = new Map(
          products.map((product) => [product._id, product])
        );

        // Match cart items with product details from the products array
        const updatedCartItems = data.cart.map((cartItem) => {
          const product = productMap.get(cartItem.productID);
          return product
            ? {
                ...cartItem,
                name: product.name,
                price: product.price || 0, // Default to 0 if price is undefined
                image: product.image || "/default-product-img.png", // Default image
                description: product.description || "No description available", // Default description
                rate: product.rate || { average: 0 }, // Default to 0 if rate is missing
              }
            : cartItem;
        });
        setCartItems(updatedCartItems);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  // Update item count in the backend
  const updateItemCount = async (productID, newCount) => {
    try {
      const response = await fetch("http://localhost:5000/updateCount", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userId,
          productID: productID,
          newCount,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        // Create a Map for faster lookups of products by productID
        const productMap = new Map(
          products.map((product) => [product._id, product])
        );

        // Match cart items with product details from the products array
        const updatedCartItems = data.cart.map((cartItem) => {
          const product = productMap.get(cartItem.productID);
          return product
            ? {
                ...cartItem,
                name: product.name,
                price: product.price || 0, // Default to 0 if price is undefined
                image: product.image || "/default-product-img.png", // Default image
                description: product.description || "No description available", // Default description
                rate: product.rate || { average: 0 }, // Default to 0 if rate is missing
              }
            : cartItem;
        });
        setCartItems(updatedCartItems);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating item count:", error);
    }
  };

  // Delete an item from the cart in the backend
  const deleteFromCart = async (productID) => {
    try {
      const response = await fetch("http://localhost:5000/deleteFromCart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: userId, productID }),
      });
      const data = await response.json();
      if (data.success) {
        // Create a Map for faster lookups of products by productID
        const productMap = new Map(
          products.map((product) => [product._id, product])
        );

        // Match cart items with product details from the products array
        const updatedCartItems = data.cart.map((cartItem) => {
          const product = productMap.get(cartItem.productID);
          return product
            ? {
                ...cartItem,
                name: product.name,
                price: product.price || 0, // Default to 0 if price is undefined
                image: product.image || "/default-product-img.png", // Default image
                description: product.description || "No description available", // Default description
                rate: product.rate || { average: 0 }, // Default to 0 if rate is missing
              }
            : cartItem;
        });
        setCartItems(updatedCartItems);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Calculate the total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.price * item.count || 0),
      0
    );
  };

  // Fetch cart items on component mount or when userID changes
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, products]); // Also refetch if products are updated

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="cart">
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item.productID} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = "/default-product-img.png"; // Fallback image
                }}
              />
              <div className="cart-item-details">
                <h5 className="cart-item-name">{item.name}</h5>
                <p className="cart-item-description">{item.description}</p>
                <p className="cart-item-price">{`$${item.price}`}</p>
                <div style={{ width: "100px", padding: "0" }}>
                  <SvgRating value={item.rate?.average || 0} />
                </div>
                <div className="cart-item-controls">
                  <button
                    className="quantity-button"
                    onClick={() => {
                      const newCount = item.count - 1;
                      if (newCount > 0) {
                        updateItemCount(item.productID, newCount);
                      } else {
                        deleteFromCart(item.productID);
                      }
                    }}
                  >
                    −
                  </button>
                  <div className="quantity-display">{item.count}</div>
                  <button
                    className="quantity-button plus"
                    onClick={() => {
                      updateItemCount(item.productID, item.count + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
        </>
      ) : (
        <p className="cart-empty-message">Your cart is empty!</p>
      )}
    </div>
  );
}

export default Cart;
