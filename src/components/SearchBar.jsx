import React, { useState, useEffect } from 'react';
import './Style.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

function SearchBar() {
    const { data: products, loading, error } = useFetchData('https://saleem-footwear-api.vercel.app/api/v1/products');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        filterResults();
    }, [searchTerm, products]);

    const filterResults = () => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase())||
                product.gender.toLowerCase().includes(searchTerm.toLowerCase())||
                // product.description.toLowerCase().includes(searchTerm.toLowerCase())||
                product.price === (Number(searchTerm))
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults([]); // Clear results if no search term
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data</p>;

    return (
        <div className='search-container'>
          
            <input 
                type='text' 
                placeholder='Search Product' 
                className='search-bar' 
                value={searchTerm}
                onChange={handleSearchChange}
            />
            
            <div className='results-container'>
                {filteredResults.length > 0 ? (
                    <div>
                        {filteredResults.map((product) => (
                            
                            <div className="product-card" key={product.id} style={{backgroundColor:'#EDEADE'}}>
          <Link to={`/product/${product.id}`}>
            <div className="product-image-gallery">
              {product.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" />
              ))}
            </div>
            <div className="product-details">
              <h2 className="product-name">{product.article}</h2>
              <p className="product-brand">{product.brand}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-info">
                <p className="product-mrp">MRP: ₹{product.price}</p>
                <p className="product-material">Material: {product.material}</p>
                <p className="product-gender">Gender: {product.gender}</p>
              </div>
              <p className="product-sizes">
                Available Sizes: {product.itemSet && product.itemSet.length > 0 
                  ? product.itemSet.map(item => `${item.size} (Length: ${item.lengths})`).join(', ') 
                  : "N/A"}
              </p>
              <p className="product-colors">
                Colors: {product.colors && Object.keys(product.colors).length > 0 
                  ? Object.keys(product.colors).join(', ') 
                  : "N/A"}
              </p>
            </div>
          </Link>
        </div> // Displaying 'name', adjust according to your data structure
                        ))}
                    </div>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        
        </div>
        
    );
}

export default SearchBar;
