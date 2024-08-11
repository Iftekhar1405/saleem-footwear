import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


const URL = "http://localhost:7000/api/v1";
const registerUser = async (body) => {
  try {
    const response = await axios.post(`${URL}/auth/register`, body)
    console.log(response.data)
  } catch (error) {
    console.log(error.response.data)
  }
}
// const body_reg = {
//   name: "Syed Amaan Ali",
//   email: "Syedamaan@gmail.com",
//   password: "secret",
//   address: "dskjf",
//   phone:"9826152780"
// }
// registerUser(body_reg)
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const body_reg = {
        name: name,
        email: email,
        password: password,
        address: address,
        phone:phone
      }
    console.log(body_reg);
    registerUser(body_reg)
    
    // try {
    //   const response = await axios.post('https://your-backend-url.com/api/register', {
    //     name,
    //     email,
    //     password,
    //     address,
    //     phone,
    //     role
    //   });
    //   console.log(response.data);
    //   // Handle successful registration response here
    // } catch (error) {
    //   console.error('There was an error registering!', error);
    //   // Handle registration error here
    // }
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
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
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
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={handleRoleChange} required>
            <option value="" disabled>Select Role</option>
            <option value="user">Customer</option>
            <option value="Staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="login-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;