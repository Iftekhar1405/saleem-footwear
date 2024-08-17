import React from "react";
import "./BrandScroller.css";
import paragon from "./images/paragon.jpg"
import shoefact from "./images/shoefact.jpeg"
import columbus from "./images/columbus.png"

const brands = [
  { id: 1, name: "Paragon", image: paragon },
  { id: 2, name: "Shoe Factory", image: shoefact },
  { id: 2, name: "Columbus", image: columbus },
  // Add more brand objects as needed
];

const BrandScroller = () => {
  return (
    <div className="brand-cont"> 
    <h3>Brands We Deal in --</h3>
    <div className="brand-container">
      
      {brands.map((brand) => (
        <div key={brand.id} className="brand-card">
          <img src={brand.image} alt={brand.name} />
          <p>{brand.name}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default BrandScroller;
