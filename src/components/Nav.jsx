import React, { useState } from 'react';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import logo from './images/logo.png'
import RoleBasedComponent from '../RoleBasedComponents';

function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const logout = () => {
        const confirm = window.confirm('Are you sure, you want to logout')
        
        if(confirm){
            localStorage.removeItem('token')
            navigate('/prelogin')
        }
    }
    return (
        <div className='Nav'>
            <h2> <img src={logo} alt=""  className='logo'/> Saleem Footwear</h2>
            <div className='hamburger' onClick={toggleMenu}>
                &#9776; {/* Unicode character for hamburger icon */}
            </div>
            <div className={`menu ${isOpen ? 'open' : ''}`}>
                <a href='#home'>Home</a>
                <a href='/catelog'>Catelog</a>
                <RoleBasedComponent allowedRoles={['admin']}>
                <a href='/register'>Register Users</a>
                </RoleBasedComponent>
                <button onClick={logout}>Log-out</button>
            </div>
        </div>
    );
}

export default Nav;
