import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Login.css';


const URL = "http://localhost:7000/api/v1";
// login request method
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login_body = {
      identifier: email,
      password: password,
    };
    
    loginUser(login_body);
  };

  const loginUser = async (body) => {
    try {
      const response = await axios.post(`${URL}/auth/login`, body);
      console.log("Login Successful:", response.data);
      let token = response.data.token;
      let role = response.data.userToken.role;
      
      localStorage.setItem("token", token);
      localStorage.setItem('role', role);
      navigate('/'); 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" className="login-btn">Log In</button>
      </form>
    </div>
  );
}

export default Login;