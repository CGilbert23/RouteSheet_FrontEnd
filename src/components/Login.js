import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { isAuth } from "../redux/actions/login";

const Login = () => {
  const dispatch = useDispatch();
  const initialForm = {
    email: "",
    password: "",
  };

  const [userDetails, setUserDetails] = useState(initialForm);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleLogin = () => { 
        dispatch(isAuth(userDetails));
    
  };

  return (
    <div className="login-container">
      <div className="login-page">
        <h1>Login</h1>
        <label className="login-label">
          Email:
          <input
            name="email"
            value={userDetails.email}
            onChange={handleInput}
            type="text"
          ></input>
        </label>
        <label className="login-label">
          Password:
          <input
            name="password"
            value={userDetails.password}
            onChange={handleInput}
            type="password"
          ></input>
        </label>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <Link to="/register" className="register-or-login-links">Don't have an account? Register Here</Link>
      </div>
    </div>
  );
};

export default Login;
