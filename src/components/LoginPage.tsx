import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ApiResponse, LoginResponse } from '../types/apiResponses';
import ApiService from '../services/api';

// TODO: Only issue with login is to keep the front end authorized when logged in

interface LoginPageProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
    const [uniqueId, setUniqueId] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response: ApiResponse<LoginResponse> = await ApiService.login(uniqueId);
            if (response.status === 200 && response.data.status === 'success') {
                setIsAuthenticated(true);
                setMessage(response.data.message);
            } else {
                setMessage(response.data.message || 'Login failed. Please check your ID and try again.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An unexpected error occurred. Please try again later.');
        }
    };


    return (
      <div className="login-page">
          <div>
              <h2 className="font-bold">Client Login</h2>
              <input
                type="text"
                placeholder="Enter your unique ID"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                className="border border-gray rounded mt-2"
              />
              <button onClick={handleLogin} className="ml-3">Login</button>
              {message && <p>{message}</p>}
              <div className="mt-2 flex items-center space-x-2">
                  <p>Don't have a unique ID?</p>
                  <Link to="/register">
                      <button className="text-blue-600 underline">Register</button>
                  </Link>
              </div>
          </div>
      </div>
    );
};

export default LoginPage;
