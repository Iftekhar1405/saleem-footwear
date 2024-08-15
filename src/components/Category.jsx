import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Category.css';
import categoryData from './db/Category.json'; // Adjust the path as needed

const CategoryGrid = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const navigate = useNavigate();

  const handleMainCategoryClick = (mainCategory) => {
    setSelectedMainCategory((prevCategory) => (prevCategory === mainCategory ? null : mainCategory));
  };

  const handleSubCategoryClick = (subCategory) => {
    navigate(`/products/${subCategory.name}`);
  };

  const handleAllFootwearsClick = () => {
    navigate('/products/all');
  };

  return (
    <div className="category-container">
      <div className="category-buttons">
        <button onClick={handleAllFootwearsClick}>All Footwears</button>
        <button onClick={() => handleMainCategoryClick('mens')}>Men's Footwear</button>
        <button onClick={() => handleMainCategoryClick('womens')}>Women's Footwear</button>
        <button onClick={() => handleMainCategoryClick('kids')}>Kids' Footwear</button>
      </div>

      {selectedMainCategory && (
        <div className="subcategory-container">
          <h2>{selectedMainCategory.charAt(0).toUpperCase() + selectedMainCategory.slice(1)} Subcategories</h2>
          <div className="subcategory-buttons">
            {categoryData[selectedMainCategory].map((subCategory) => (
              <button key={subCategory.id} onClick={() => handleSubCategoryClick(subCategory)}>
                <img src={subCategory.image} alt={subCategory.name}/>
                {subCategory.name.charAt(0).toUpperCase() + subCategory.name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
