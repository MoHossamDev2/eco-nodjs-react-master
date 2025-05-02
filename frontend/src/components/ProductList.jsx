import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import "./productsList.css";

function ProductList({
  setCartItems,
  cartItems,
  currentUser,
  products,
  filteredProducts,
}) {
  return (
    <>
      {products && (
        <div className="product-container">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              setCartItems={setCartItems}
              cartItems={cartItems}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ProductList;
