import React from 'react';
import './Style.css';

function SearchBar() {
    return (
        <div className='search-container'>
            <input type='text' placeholder='Search Product' className='search-bar' />
            <div className='search-row'>
                <input type='text' placeholder='Search by Article' className='half-width' />
                <select className='half-width'>
                    <option value=''>Search by Brand</option>
                    <option value='brand1'>Brand 1</option>
                    <option value='brand2'>Brand 2</option>
                    <option value='brand3'>Brand 3</option>
                </select>
            </div>
        </div>
    );
}

export default SearchBar;
