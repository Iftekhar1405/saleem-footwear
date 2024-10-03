import React, { useState } from 'react';
import './Style.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './images/logo.png';
import RoleBasedComponent from '../RoleBasedComponents';

function Nav() {
    let token = localStorage.getItem('token');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const logout = () => {
        const confirm = window.confirm('Are you sure you want to log out?');
        if (confirm) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        }
    };

    return (
        <>
            <div className='Nav'>
                <div>
                    <img src={logo} alt="Logo" className='logo' /> 
                    <h2 style={{ display: 'inline' }} className='brand-name'>Salim Footwear</h2>
                </div>

                <div className='hamburger' onClick={toggleMenu}>
                    &#9776; {/* Unicode character for hamburger icon */}
                </div>

                <div className={`menu ${isOpen ? 'open' : ''}`}>
                    <a href='/orders'>Orders</a>
                    <a href='/catalog'>Catalogue</a>
                    <RoleBasedComponent allowedRoles={['admin']}>
                        <a href='/register'>Register Users</a>
                    </RoleBasedComponent>
                    <Link to='/profile'>Profile</Link>

                    {token ? (
                        <button onClick={logout}>Log-out</button>
                    ) : (
                        <button onClick={() => navigate('/login')}>Log-in</button>
                    )}
                </div>
            </div>

            <pre style={{ fontSize: '13px', marginBottom: '5px', textAlign: 'center', backgroundColor: '#000', marginTop: '0' }}>
                Ayan-Marg Ambikapur, Chhattisgarh 497001
            </pre>
        </>
    );
}

export default Nav;
