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
        <>
        <div className='Nav'>
            <div> <img src={logo} alt=""  className='logo'/> <h2 style={{display:'inline'}}>Salim Footwear
            </h2></div>
            <div className='hamburger' onClick={toggleMenu}>
                &#9776; {/* Unicode character for hamburger icon */}
            </div>
            <div className={`menu ${isOpen ? 'open' : ''}`}>
                <a href='/orders'>Orders</a>
                <a href='/catelog'>Catalogue</a>
                <RoleBasedComponent allowedRoles={['admin']}>
                <a href='/register'>Register Users</a>
                </RoleBasedComponent>
                <button onClick={logout}>Log-out</button>
            </div>
        </div>
        <pre style={{fontSize:'13px',marginBottom:'5px',textAlign:'center', backgroundColor:'#000', marginTop:'0'}}>
            Ayan-Marg Ambikapur 
            Chhattisgarh 497001</pre>

        </>
    );
}

export default Nav;
