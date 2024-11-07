import React, { useState } from 'react';
import {Link} from "react-router-dom";

interface LoginPageProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
    const [uniqueId, setUniqueId] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = () => {
        // Simulate a test case by checking if the unique ID matches a specific value
        if (uniqueId === 'test123') {
            setIsAuthenticated(true);
            setMessage('');
        } else {
            setMessage('Login failed. Please check your ID and try again.');
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
                  <p>Don't have an unique ID?</p>
                  <Link to="/register">
                      <button className="text-blue-600 underline">Register</button>
                  </Link>
              </div>
          </div>
      </div>
    );
};

export default LoginPage;
