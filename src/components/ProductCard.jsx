import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';

// Define the function to add to cart with the selected color, size, and quantity
const addToCart = async (product, selectedColor, selectedSize, quantity) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Find the selected size item from the itemSet
  const selectedItemSet = product.itemSet.find(item => item.size === selectedSize);

  const body = {
    productId: product.id,
    quantity: quantity,
    itemSet: selectedItemSet ? [selectedItemSet] : [], // Only include the selected size
    color: selectedColor,
    size: selectedSize
  };

  try {
    const response = await axios.post('https://saleem-footwear-api.vercel.app/api/v1/cart/add-to-cart', body, { headers });
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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://saleem-footwear-api.vercel.app/api/v1/products/${id}`);
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

  const handleQuantityChange = (action) => {
    setQuantity(prevQuantity => {
      if (action === 'increment') {
        return prevQuantity + 1;
      } else if (action === 'decrement' && prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && quantity > 0) {
      addToCart(product, selectedColor, selectedSize, quantity);
      alert('Item Added to Cart Successfully');
      window.dispatchEvent(new Event('cart-updated'));
        } else {
      alert('Please select a color, size, and a valid quantity.');
    }
  };

  const imagesToShow = selectedColor ? product.colors[selectedColor] : product.images;

  return (
    <div>
      <div className="product-image-gallery">
        {imagesToShow && imagesToShow.length > 0 ? (
          imagesToShow.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt={`${product.brand} ${product.article} ${selectedColor}`} className="product-image" 
            style={{width:'100%'}}/>
          ))
        ) : (
          <p>No images available for this color.</p>
        )}
      </div>
      <div className="product-details" style={{color:'#36454f',fontWeight:'bold',backgroundColor:'white'}} >
        <h2 className="product-name">{product.article}</h2>
        <div className="product-colors" style={{margin:'20px auto',width:'100vw'}}>
          Colors: {product.colors && Object.keys(product.colors).length > 0 
            ? Object.keys(product.colors).map(color => (
              <button 
                key={color} 
                className={`color-button ${selectedColor === color ? 'selected' : ''}`} 
                onClick={() => handleColorClick(color)}
                style={{ borderColor:color,backgroundColor:'white',color:'black' }}
              >
                {color}
              </button>
            )) 
            : "N/A"}
        </div>
        <p className="product-mrp" style={{textDecoration:'none'}}>MRP: ₹{product.price}</p>
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

        <p className="product-brand">{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-material">Material: {product.material}</p>
        <p className="product-gender">Gender: {product.gender}</p>
        
        
        <div className="quantity-selector" style={{margin:'20px auto',width:'100vw'}}>
          <button onClick={() => handleQuantityChange('decrement')} >-</button>
          <input type="number" value={quantity} readOnly  style={{margin:'5px', height:'30px'}}/>
          <button onClick={() => handleQuantityChange('increment')} style={{marginLeft:'8px'}}>+</button>
        </div>
      </div>
      <div className="buttons" style={{width:'100vw'}}>
        <button onClick={handleAddToCart} style={{width :'90%', display: 'flex',alignItems:'center',justifyContent:'center',gap:'15px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
          </svg>
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
