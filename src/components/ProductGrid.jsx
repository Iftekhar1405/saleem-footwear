import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';
import { Link } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem('token');

const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(false); // Track errors
  const [hasMore, setHasMore] = useState(true); // Track if there's more data to load
  const pageRef = useRef(1); // Use useRef to track the current page

  const fetchData = async (page) => {
    if (loading || !hasMore) return; // Prevent fetching when loading or no more data

    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { page, limit }, // Send current page and limit in the request
      });

      if (response.data.products.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) => [...prevData, ...response.data.products]); // Append new data to the existing data
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the page changes
  useEffect(() => {
    fetchData(pageRef.current); // Fetch based on the ref value
  }, [url]); // Only refetch if the URL changes

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollPosition = window.scrollY;
  
    // Check if user has scrolled near the bottom and if more data is available
    if (currentScrollPosition >= scrollableHeight - 100 && !loading && hasMore) {
      pageRef.current += 1; // Increment the page using the ref
      fetchData(pageRef.current); // Fetch the next page
    }
  }, [loading, hasMore]);
  
  useEffect(() => {
    const onScroll = () => {
      if (hasMore) {
        handleScroll(); // Only call the scroll handler if more data is available
  

      }
    };
    if(hasMore){     window.addEventListener('scroll', onScroll);}
    else {window.removeEventListener('scroll', onScroll);} // Clean up event listener
    
  }, [handleScroll, hasMore]); // Re-run only if handleScroll or hasMore changes
  
  
  

  return { data, loading, error, hasMore };
};

const ProductGrid = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Something went wrong</h2>;
  }

  return (
    <div className="product-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0',
      margin: '0',
    }}>
      {products.map((product) => (
        <div className="product-card" key={product._id} style={{
          margin: '0',
          borderRadius: '0',
          width: '50vw',
          backgroundColor: '#EDEADE',
        }}>
          <Link to={`/product/${product._id}`}>
            <div className="product-image-gallery">
              {product.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" style={{
                  height: '180px',
                  width: '200px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }} />
              ))}
            </div>
            <div className="product-details" style={{
              backgroundColor: '#EDEADE',
              paddingBottom: '0px',
              paddingRight: '10px',
              marginBottom: '0',
            }}>
              <h2 className="product-name">{product.article}</h2>
              <p className="product-brand">{product.brand}</p>
              <div className="product-info" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                color: '#36454f',
                fontWeight: 'bold',
              }}>
                <span className="product-mrp" style={{
                  textDecoration: 'none',
                  marginBottom: '5px',
                }}>MRP: ₹{product.price}</span>
                <br />
                <span className="product-colors" style={{
                  color: '#36454f',
                  fontWeight: 'bold',
                  fontSize: 'small',
                  opacity: '0.75',
                }}>
                  Colors: {product.colors && Object.keys(product.colors).length > 0
                    ? Object.keys(product.colors).join(', ')
                    : "N/A"}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
