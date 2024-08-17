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
            
            <div className="product-grid" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0',margin:'0'
      
    }}>                {filteredResults.length > 0 ? (
                    <>
                        {filteredResults.map((product) => (
                            
                            <div className="product-card" key={product._id} style={{margin:'0',borderRadius:'0',width:'50vw',backgroundColor:'#EDEADE'}} >
          <Link to={`/product/${product._id}`}>
            <div className="product-image-gallery">
              {product.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" />
              ))}
            </div>
            <div className="product-details"  style={{backgroundColor:'#EDEADE',paddingBottom:'0px',paddingRight:'10px'
              ,marginBottom:'0'
            }}>
            
              <h2 className="product-name">{product.article}</h2>
              <p className="product-brand">{product.brand}</p>
              <div className="product-info" style={{display:'flex',flexDirection:'column',alignItems:'flex-start',color:'#36454f',fontWeight:'bold'
                ,
              }}>
                <span className="product-mrp" style={{textDecoration:'none',marginBottom:'5px'}}>MRP: ₹{product.price}</span>
                <br />
                <span className="product-colors" style={{color:'#36454f',fontWeight:'bold',fontSize:'small', opacity:'0.75'
                }}>
                Colors: {product.colors && Object.keys(product.colors).length > 0 
                  ? Object.keys(product.colors).join(', ') 
                  : "N/A"}
              </span>
                
                {/* <div style={{display:'flex',justifyContent:'space-between', width:'100%', margin:'0px'}}>
                <p className="product-material">Material: {product.material}</p>
                <p className="product-gender">Gender: {product.gender}</p>
                </div> */}
              </div>
              {/* <p className="product-sizes">
                Available Sizes: {product.itemSet && product.itemSet.length > 0 
                  ? product.itemSet.map(item => `${item.size} (PCs: ${item.lengths})`).join(', ') 
                  : "N/A"}
              </p> */}
              
            </div>
          </Link>
          {/* <div className="buttons">
            <button onClick={() => addToLiked(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
              </svg>
            </button>
            <span className="v-bar"> &#124;</span>
            <button onClick={() => addToCart(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
              </svg>
            </button>
          </div> */}
        </div> // Displaying 'name', adjust according to your data structure
                        ))}
                    </>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        
        </div>
        
    );
}

export default SearchBar;
