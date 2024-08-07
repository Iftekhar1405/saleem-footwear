import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
    window.dispatchEvent(new Event(`${key}-updated`));
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};

const ProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useLocalStorage('cart', []);
  const [liked, setLiked] = useLocalStorage('liked', []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/products/${id}`);
        setProduct(response.data.product);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const addToCart = (product) => setCart([...cart, product]);
  const addToLiked = (product) => setLiked([...liked, product]);

  return (
    <div className="product-card">
      <img src={product.images} alt={product.name} className="product-image" />
      <div className="product-details">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-brand">{product.brand}</p>
        <div className="product-info">
          <p className="product-mrp">MRP: ₹{product.price}</p>
          <p className="product-discount">Discount: {product.discount}%</p>
        </div>
        <p className="product-discounted-price">
          Discounted Price: ₹{product.price - (product.price * product.discount / 100)}
        </p>
        <p className="product-sizes">For: {product.gender}</p>
        {/* <p className="product-sizes">
          Sizes: {product.size.map(size => `${size.size} (Length: ${size.length})`).join(', ')}
        </p> */}
        <p className="product-description">{product.description}</p>

        {/* <select className='product-size'>
          <option value="">Choose size</option>
          {product.set.sizes.map((size, index) => (
            <option key={index} value={size.size}>{size.size} (Length: {size.length})</option>
          ))}
        </select> */}

        <select name="set" className='product-set-len'>
          <option value="">Choose set</option>
          {['set1', 'Set 2', 'Set 3'].map((set, index) => (
            <option key={index} value={set}>{set}</option>
          ))}
        </select>

        <div className='buttons'>
          <button className="header-button" onClick={() => addToLiked(product)}>
            {/* SVG for Like button */}
          </button>
          <span className="v-bar"> &#124;</span>
          <button className="header-button" onClick={() => addToCart(product)}>
            {/* SVG for Cart button */}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard