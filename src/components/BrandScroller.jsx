import React from "react";
import "./BrandScroller.css";

const brands = [
  { id: 1, name: "Brand 1", image: "brand1.jpg" },
  { id: 2, name: "Brand 2", image: "brand2.jpg" },
  // Add more brand objects as needed
];

const BrandScroller = () => {
  return (
    <div className="brand-container">
      {brands.map((brand) => (
        <div key={brand.id} className="brand-card">
          <img src={brand.image} alt={brand.name} />
          <p>{brand.name}</p>
        </div>
      ))}
    </div>
  );
};

export default BrandScroller;
