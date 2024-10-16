import React, { useState, useEffect } from 'react';
import './Style.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchInput = React.memo(({ searchTerm, onSearchChange }) => (
    <div className='search-container'>
        <input
            type='text'
            placeholder='Search Product'
            className='search-bar'
            value={searchTerm}
            onChange={onSearchChange}
        />
    </div>
));

const SearchResults = React.memo(({ filteredResults, loading, error }) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data</p>;

    return (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0', margin: '0' }}>
            {filteredResults.length > 0 ? (
                <>
                    {filteredResults.map((product) => (
                        <div className="product-card" key={product._id} style={{ margin: '0', borderRadius: '0', width: '50vw', backgroundColor: '#EDEADE' }}>
                            <Link to={`/product/${product._id}`}>
                                <div className="product-image-gallery">
                                    {product.images.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`${product.brand} ${product.article}`}
                                            className="product-image"
                                            style={{ height: '180px', width: '200px', objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                    ))}
                                </div>
                                <div className="product-details" style={{ backgroundColor: '#EDEADE', paddingBottom: '0px', paddingRight: '10px', marginBottom: '0' }}>
                                    <h2 className="product-name">{product.article}</h2>
                                    <p className="product-brand">{product.brand}</p>
                                    <div className="product-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: '#36454f', fontWeight: 'bold' }}>
                                        <span className="product-mrp" style={{ textDecoration: 'none', marginBottom: '5px' }}>MRP: ₹{product.price}</span>
                                        <br />
                                        <span className="product-colors" style={{ color: '#36454f', fontWeight: 'bold', fontSize: 'small', opacity: '0.75' }}>
                                            Colors: {product.colors && Object.keys(product.colors).length > 0 ? Object.keys(product.colors).join(', ') : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
});

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 600);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchProducts(debouncedSearchTerm);
        } else {
            setFilteredResults([]);
        }
    }, [debouncedSearchTerm]);

    const searchProducts = async (term) => {
        setLoading(true);
        setError(false);

        try {
            const response = await axios.get(`https://saleem-footwear-api.vercel.app/api/v1/search?q=${term}`);
            setFilteredResults(response.data.products);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <SearchResults filteredResults={filteredResults} loading={loading} error={error} />
        </>
    );
};

export default SearchBar;
