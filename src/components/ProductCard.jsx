import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';

// Define the function to add to cart with the selected color and size
const addToCart = async (product, selectedColor, selectedSize) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Find the selected size item from the itemSet
  const selectedItemSet = product.itemSet.find(item => item.size === selectedSize);

  const body = {
    productId: product.id,
    quantity: 1, // or a quantity input from the user if available
    itemSet: selectedItemSet ? [selectedItemSet] : [], // Only include the selected size
    color: selectedColor,
    size: selectedSize
  };

  try {
    const response = await axios.post('http://localhost:7000/api/v1/cart/add-to-cart', body, { headers });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

const ProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/products/${id}`);
        setProduct(response.data.product);

        // Set default color if available
        if (response.data.product.colors && Object.keys(response.data.product.colors).length > 0) {
          setSelectedColor(Object.keys(response.data.product.colors)[0]);
        }

        // Populate sizes
        if (response.data.product.itemSet) {
          setSizes(response.data.product.itemSet);
          if (response.data.product.itemSet.length > 0) {
            setSelectedSize(response.data.product.itemSet[0].size); // Set default size
          }
        }

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart(product, selectedColor, selectedSize);
      alert('Item Added to Cart Successfully')
    } else {
      alert('Please select a color and a size.');
    }
  };

  const imagesToShow = selectedColor ? product.colors[selectedColor] : product.images;

  return (
    <div>
      <div className="product-image-gallery">
        {imagesToShow && imagesToShow.length > 0 ? (
          imagesToShow.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt={`${product.brand} ${product.article} ${selectedColor}`} className="product-image" />
          ))
        ) : (
          <p>No images available for this color.</p>
        )}
      </div>
      <div className="product-details">
        <h2 className="product-name">{product.article}</h2>
        <p className="product-brand">{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-mrp">MRP: ₹{product.price}</p>
        <p className="product-material">Material: {product.material}</p>
        <p className="product-gender">Gender: {product.gender}</p>
        <div className="product-sizes">
          <label htmlFor="size-select">Available Sizes:</label>
          <select id="size-select" value={selectedSize} onChange={handleSizeChange}>
            {sizes.length > 0 ? (
              sizes.map((item, index) => (
                <option key={index} value={item.size}>
                  {item.size} (PCs: {item.lengths})
                </option>
              ))
            ) : (
              <option value="">N/A</option>
            )}
          </select>
        </div>
        <div className="product-colors">
          Colors: {product.colors && Object.keys(product.colors).length > 0 
            ? Object.keys(product.colors).map(color => (
              <button 
                key={color} 
                className={`color-button ${selectedColor === color ? 'selected' : ''}`} 
                onClick={() => handleColorClick(color)}
                style={{ backgroundColor: color }}
              >
                {color}
              </button>
            )) 
            : "N/A"}
        </div>
      </div>
      <div className="buttons">
        <button>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
              </svg>
        </button>
        <span className="v-bar"> &#124;</span>
        <button onClick={handleAddToCart}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
              </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
