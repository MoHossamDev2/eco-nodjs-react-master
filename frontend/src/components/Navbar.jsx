import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "./Logo";
import "./Navbar.css";

export default function Navbar({ setFilteredProducts, currentUser }) {
  const navigate = useNavigate();
  const api_url = "http://localhost:5000/allProducts";
  const cart_api_url = "http://localhost:5000/getCart"; // API endpoint for cart data
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchInput, setSearchInput] = useState(null);

  let activeUser = currentUser;

  if (!activeUser) {
    try {
      const storedUser = localStorage.getItem("currentUser");
      activeUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      activeUser = null;
    }
  }

  const isLoggedIn = Boolean(activeUser?.user);

  // Fetch cart items from API
  useEffect(() => {
    if (isLoggedIn && activeUser?.user?._id) {
      fetch(`${cart_api_url}/${activeUser.user._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCartItems(data.cart);
          } else {
            setCartItems([]); // No cart or error in fetching
          }
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
          setCartItems([]);
        });
    }
  }, [isLoggedIn, activeUser?.user?._id]);

  // Get total number of items in the cart using reduce
  const getTotalItemsInCart = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // Pass event to handleSearch
    }
  };

  const handleSearch = (e) => {
    if (!e.target.value?.trim()) {
      setFilteredProducts(products);
      return;
    }
    const searchQuery = e.target.value?.trim().toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleClickProfile = () => {
    navigate(isLoggedIn ? "/userProfile" : "/signup");
  };

  const handleClickCart = () => {
    navigate(isLoggedIn ? "/cart" : "/signup");
  };

  useEffect(() => {
    fetch(api_url)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <nav className="navBar">
      <Logo />
      <h1 className="infinity" onClick={() => navigate("/")}>
        infinity
      </h1>
      {activeUser?.user?.isAdmin ? (
        <div className="wrapper">
          <Link to="/addProduct" className="addProduct">
            Add product
          </Link>
          <img
            onClick={handleClickProfile}
            src={activeUser?.user?.image || "/default-profile-img.jpg"}
            className="anonymous"
            alt="profile"
            onError={(e) => {
              e.target.src = "./default-profile-img.jpg";
            }}
          />
        </div>
      ) : (
        <div className="wrapper">
          <img
            onClick={handleClickCart}
            src="/shoppingCart.png"
            className="shoppingCart"
            alt="cart"
          />
          {cartItems.length > 0 && (
            <span className="test">{getTotalItemsInCart()}</span>
          )}
          <img
            onClick={handleClickProfile}
            src={activeUser?.user?.image || "/default-profile-img.jpg"}
            className="anonymous"
            alt="profile"
            onError={(e) => {
              e.target.src = "./default-profile-img.jpg";
            }}
          />
        </div>
      )}
      <div className="test2">
        <input
          type="text"
          className="search"
          placeholder="search in infinity"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            backgroundColor: "rgb(41, 101, 220)",
            borderRadius: "10%",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/");
            handleSearch({ target: { value: searchInput } });
          }}
        >
          <circle cx="11" cy="11" r="6"></circle>
          <line x1="16" y1="16" x2="22" y2="22"></line>
        </svg>
      </div>
    </nav>
  );
}
