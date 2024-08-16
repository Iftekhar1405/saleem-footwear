import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/category'; // Adjust the URL if needed

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(URL, {
          maxBodyLength: Infinity
        });
        setCategories(response.data); // Assuming response.data contains the categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
            {categories[selectedMainCategory]?.map((subCategory) => (
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
