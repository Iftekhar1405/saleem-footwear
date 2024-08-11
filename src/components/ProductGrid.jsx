import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';
import { Link } from 'react-router-dom';








const URL = "http://localhost:7000/api/v1";

const AddToCart = async (body) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
      },
    };

    const cartResponse = await axios.post(`${URL}/cart`, body, config);
    console.log(cartResponse);
    
  } catch (error) {
    console.error(error.response);
  }
};

// Example body for AddToCart function
const body = {
  productId: "66ae03b57fe12df8e998e449",
  quantity: 3,
  itemSet: [{
    size: "UK-12",
    lengths: 4
  }],
  color: "red"
};

// Call the function
AddToCart(body);











const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.products);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { data, loading, error };
};

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

const ProductGrid = () => {
  const { data: products, loading, error } = useFetchData('http://localhost:7000/api/v1/products');
  const [cart, setCart] = useLocalStorage('cart', []);
  const [liked, setLiked] = useLocalStorage('liked', []);

  const addToCart = (product) => setCart([...cart, product]);
  const addToLiked = (product) => setLiked([...liked, product]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        
          <div className="product-card">
            <Link to={`/product/${product.id}`} key={product.id}>
            <img src={product.images} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-brand">{product.brand}</p>
              <div className="product-info">
                <p className="product-mrp">MRP: ₹{product.price}</p>
                <p className="product-discount">Discount: {product.discount}%</p>
              </div>
              <p className="product-discounted-price">
                Discounted Price: ₹{product.price - product.discount * (product.price / 100)}
              </p>
              <p className="product-sizes">For: {product.style}</p>
              <p className="product-sizes">Colors: {product.color.join(', ')}</p>
              </div>
              </Link>
              <div className="buttons">
                <button  onClick={() => addToLiked(product)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
                </button>
                <span className="v-bar"> &#124;</span>
                <button  onClick={() => addToCart(product)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path fill="#ffffff" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
          </svg>
                </button>
              
            </div>
          </div>
        
      ))}
    </div>
  );
};

export default ProductGrid;