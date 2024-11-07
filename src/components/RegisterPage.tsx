import React, {useState} from 'react';
import {Link} from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [message, setMessage] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);

  const handleRegister = () => {
    if (clientName) {
      const mockId = 'test123';
      // setGeneratedId(mockId);
      setMessage('Registration successful! Your unique ID is: ' + mockId);
      setShowLoginLink(true);
    } else {
      setMessage('Please enter your name.');
    }
  };
  // above logic need to be replaced by the actual logic to call backend api

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
