import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProductGrid.css';
import './ProductCard.css';
import { Link } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem('token');

const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = async (page) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { page, limit },
      });

      if (response.data.products.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...response.data.products]);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageRef.current);
  }, [url]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.scrollY;

      if (currentScrollPosition >= scrollableHeight - 100 && hasMore && !loading) {
        pageRef.current += 1;
        fetchData(pageRef.current);
      }
    };

    if (hasMore) {
      window.addEventListener('scroll', handleScroll);
    }

    // Clean up the event listener on unmount or if there's no more data
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading]); // Depend on hasMore and loading only

  return { data, loading, error, hasMore };
};

const ProductGrid = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);

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
      {loading && <h2>Loading...</h2>}
    </div>
  );
};

export default ProductGrid;
