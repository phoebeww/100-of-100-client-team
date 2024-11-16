import React, {useState} from 'react';
import {Link} from "react-router-dom";
import ApiService from "../services/api.ts";

const RegisterPage: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [message, setMessage] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);

  const handleRegister = async () => {
    if (clientName) {
      try {
        const response = await ApiService.registerOrganization(clientName);
        if (response.status === 201 && response.data.status === 'success') {
          const clientId = response.data.token;
          setMessage(`Registration successful! Your unique ID is: ${clientId}`);
          setShowLoginLink(true);
        } else {
          setMessage(`Registration failed: ${response.data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(error)
        setMessage('Error: Unable to register. Please try again later.');
      }
    } else {
      setMessage('Please enter your name.');
    }
  };

  return (
    <div className="register-page">
      <h2 className="font-bold">Registration</h2>
      <input
        type="text"
        placeholder="Enter Organization Name"
        style={{width: '17%'}}
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="border border-gray rounded mt-2"
      />
      <button onClick={handleRegister} className="ml-3">Register</button>
      {message && <p className="mt-2">{message}</p>}
      {showLoginLink && (
        <div className="flex items-center space-x-2 mt-2">
          <Link to="/">
            <button className="text-blue-600 underline">Back to Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
