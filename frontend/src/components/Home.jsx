import { Link } from "react-router-dom";
import "./Home.css";
import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import Navbar from "./Navbar";

const Home = ({
  currentUser,
  filteredProducts,
  setFilteredProducts,
  products,
}) => {
  return (
    <div>
      <Navbar
        setFilteredProducts={setFilteredProducts}
        products={products}
        currentUser={currentUser}
      />
      <ProductList
        currentUser={currentUser}
        products={products}
        setProducts={setFilteredProducts}
        filteredProducts={filteredProducts}
      />
    </div>
  );
};

export default Home;
