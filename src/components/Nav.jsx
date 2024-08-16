import React, { useState } from 'react';
import './Style.css';
import { Link, useNavigate } from 'react-router-dom';
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
            
            <div className='nav-left'>
                <Link to='/search'>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>

                </div>
                </Link>
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
        </div>
        <pre style={{fontSize:'13px',marginBottom:'5px',textAlign:'center', backgroundColor:'#000', marginTop:'0'}}>
            Ayan-Marg Ambikapur 
            Chhattisgarh 497001</pre>

        </>
    );
}

export default Nav;
