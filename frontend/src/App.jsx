import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import OrderPage from "./components/OrderPage";
import UserProfile from "./components/UserProfile";
import SingleProductPage from "./components/SingleProductPage";
import AdminProfile from "./components/adminProfile";
import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";
import EditProduct from "./components/EditProduct";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const api_url = "http://localhost:5000/allProducts";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  useEffect(() => {
    fetch(api_url)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      console.log(currentUser.user);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                currentUser={currentUser}
                setFilteredProducts={setFilteredProducts}
                products={products}
                filteredProducts={filteredProducts}
              />
            }
          />
          <Route path="/signup" element={<Signup setUser={setCurrentUser} />} />
          <Route path="/login" element={<Login setUser={setCurrentUser} />} />
          <Route path="/order" element={<OrderPage />} />
          <Route
            path="/userProfile"
            element={
              <UserProfile currentUser={currentUser} setUser={setCurrentUser} />
            }
          />
          <Route
            path="/product/:id"
            element={
              <SingleProductPage
                currentUser={currentUser}
                setFilteredProducts={setFilteredProducts}
              />
            }
          />
          <Route
            path="/adminProfile"
            element={<AdminProfile currentUser={currentUser} />}
          />
          <Route
            path="/addProduct"
            element={<AddProduct currentUser={currentUser} />}
          />
          <Route
            path="/editProduct/:productId"
            element={<EditProduct currentUser={currentUser} />}
          />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
