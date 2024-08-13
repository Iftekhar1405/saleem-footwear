import React from 'react';
import axios from 'axios';
import './Prelogin.css';
import businessSvg from './images/businessSvg.svg';
import { Link } from 'react-router-dom';

function Prelogin() {
    
    const handleLoginClick = () => {
        // Example API call to the backend using axios
        axios.post('/api/login', {
            username: 'exampleUsername',
            password: 'examplePassword'
        })
        .then(response => {
            console.log('Success:', response.data);
            // Handle successful login response here
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error here
        });
    };

    return (
        <>
            <div className="preloginCont">
                <div>
                    <img src={businessSvg} alt="" className='business-Svg' />
                </div>
                <div>
                    <h2>Order With Convenience</h2>
                    <ul>
                        <li>Order From Anywhere</li>
                        <li>Get Access To All The Products</li>
                        <li>Fastest Shipping</li>
                        <li>Filter Products With Ease</li>
                        <li>24/7 Customer Support</li>
                        <li>Easy Returns</li>
                        <li>Exclusive Deals and Discounts</li>
                        <li>Secure Payment Options</li>
                        <li>Track Your Orders in Real-Time</li>
                    </ul>
                    <Link to= '/login'>
                    <button className='login-btn' onClick={handleLoginClick}>Log-In</button>
                    </Link>
                    <Link to= '/register'>
                    <button className='login-btn' onClick={handleLoginClick}>Register Now</button>
                    </Link>
                    <Link to='/contact-us'>
                    <button className='login-btn'>Contact-Us</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Prelogin;
