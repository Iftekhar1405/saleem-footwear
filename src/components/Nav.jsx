import React, { useState } from 'react';
import './Style.css';

function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='Nav'>
            <h2>Saleem Footwear</h2>
            <div className='hamburger' onClick={toggleMenu}>
                &#9776; {/* Unicode character for hamburger icon */}
            </div>
            <div className={`menu ${isOpen ? 'open' : ''}`}>
                <a href='#home'>Home</a>
                <a href='#about'>About</a>
                <a href='#products'>Products</a>
                <a href='#contact'>Contact</a>
            </div>
        </div>
    );
}

export default Nav;
