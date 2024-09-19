import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Category.css'; // Ensure to update the CSS for new styles

const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/category'; // Adjust the URL if needed

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(URL, {
          maxBodyLength: Infinity
        });
        setCategories(response.data.data); // Assuming response.data contains the categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the category grid for the selected category
    navigate(`/category-grid/category=${category}`);
  };

  return (
    <>
      <h3> Explore Your Category --</h3>
      <div className="category-list">
        {categories.map((category, index) => (
          <span 
            key={index} 
            className="category-item" 
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </span>
        ))}
      </div>
    </>
  );
};

export default CategoryGrid;
