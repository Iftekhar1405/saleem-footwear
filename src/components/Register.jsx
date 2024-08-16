import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import RoleBasedComponent from '../RoleBasedComponents'
import { useNavigate } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(''); // Updated initial value to empty
  const navigate = useNavigate(); // Move useNavigate inside the component

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  const registerUser = async (body) => {
    try {
      const response = await axios.post(`${URL}/auth/register`, body);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.msg);
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const body_reg = {
      name: name,
      shopName: email,
      password: password,
      address: address,
      phone: phone,
      role: role || 'customer' // Ensure default role if none is selected
    };

    console.log(body_reg);
    registerUser(body_reg);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Shop Name</label>
          <input type="text" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" value={address} onChange={handleAddressChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} required />
        </div>
        <RoleBasedComponent allowedRoles={['admin']}>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={handleRoleChange} required>
              <option value="" disabled>Select Role</option>
              <option value="customer">Customer</option>
              <option value="Staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </RoleBasedComponent>
        <button type="submit" className="login-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
