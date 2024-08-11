import React, { useState } from 'react';
import './Category.css';
import categoryData from './db/Category.json'; // Adjust the path as needed

const CategoryGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };


  return (
    <div className="category-container">
      <h1>Footwear Categories</h1>
      <div className="category-buttons">
      <button onClick={() => handleCategoryClick('all')}>All Footwears</button>
        <button onClick={() => handleCategoryClick('mens')}>Men's Footwear</button>
        <button onClick={() => handleCategoryClick('womens')}>Women's Footwear</button>
        <button onClick={() => handleCategoryClick('kids')}>Kids' Footwear</button>
      </div>
      
      {selectedCategory && (
        <div className="grid-container">
          {categoryData[selectedCategory].map((item) => (
            <div key={item.id} className="grid-item">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
