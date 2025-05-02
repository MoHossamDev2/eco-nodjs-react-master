import React, { useState } from "react";
import "./OrderPage.css";

function OrderPage() {
  return (
    <div className="container">
      <h2>My orders</h2>
      <div className="order">
        <div className="order2">
          <div className="order-item1">
            {" "}
            <h3>product 1</h3>
          </div>
          <div className="order-item2">
            {" "}
            <h4>T-shirt</h4>
            <p>order:#1234</p>
            <p>orderd on : Dec 10,2024</p>
          </div>
        </div>
        <div className="order1">
          <button className="btn1">Panding</button>
          <button className="btn2">Cancel</button>
          <button className="btn3">Delvired</button>
          <button className="btn4">Remove</button>

        </div>
      </div>
      
    </div>
  );
}

export default OrderPage;
