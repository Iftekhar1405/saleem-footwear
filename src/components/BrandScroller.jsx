import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./BrandScroller.css";
import axios from "axios";
import paragon from "./images/paragon.jpg"
import shoefact from "./images/shoefact.jpeg"
import columbus from "./images/columbus.png"
import shoe from "./images/shoe.jpg"

const brands = [
  { id: 1, name: "Paragon", image: paragon },
  { id: 2, name: "Shoe Factory", image: shoefact },
  { id: 2, name: "Columbus", image: columbus },
  { id: 2, name: "--Others--", image: shoe },
  // Add more brand objects as needed
];
const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/brand'; // Adjust the URL if needed


const BrandScroller = () => {
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
    navigate(`/category-grid/brand=${category}`);
  };

  return (
    <div className="brand-cont"> 
    <h3>Brands We Deal in --</h3>
    <div className="brand-container">
      
      {brands.map((brand) => (
        <div key={brand.id} className="brand-card" onClick={ () => handleCategoryClick(brand.name.toUpperCase())}>
          <img src={brand.image} alt={brand.name} />
          <p>{brand.name}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default BrandScroller;
