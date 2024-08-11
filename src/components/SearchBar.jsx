import React, { useState, useEffect } from 'react';
import './Style.css';
import axios from 'axios';

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
    const { data: products, loading, error } = useFetchData('http://localhost:7000/api/v1/products');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        filterResults();
    }, [searchTerm, products]);

    const filterResults = () => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className='search-row'>
                <input type='text' placeholder='Search by Article' className='half-width' />
                <select className='half-width'>
                    <option value=''>Search by Brand</option>
                    <option value='brand1'>Brand 1</option>
                    <option value='brand2'>Brand 2</option>
                    <option value='brand3'>Brand 3</option>
                </select>
            </div>
            <div className='results-container'>
                {filteredResults.length > 0 ? (
                    <ul>
                        {filteredResults.map((item, index) => (
                            <li key={index}>{item.name}</li> // Displaying 'name', adjust according to your data structure
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
