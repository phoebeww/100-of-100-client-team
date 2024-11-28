import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ApiResponse, LoginResponse } from '../../types/apiResponses.ts';
import ApiService from '../../services/api.ts';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginPageProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!firstName.trim() || !lastName.trim() || !employeeId.trim()) {
            setMessage('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            const response: ApiResponse<LoginResponse> = await ApiService.login(employeeId, fullName);

            if (response.status === 200 && response.data.status === 'success') {
                setIsAuthenticated(true);
                localStorage.setItem('employeeId', employeeId);
                localStorage.setItem('employeeName', fullName);
                setMessage(response.data.message);
            } else {
                setMessage('Login failed. Please check your details and try again.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md space-y-6">
              <div className="space-y-4 text-center">
                  <h1 className="text-4xl font-extrabold text-gray-900">
                      HospitalTracker<sup className="text-lg">®</sup>
                  </h1>
                  <h2 className="text-3xl font-bold">Employee Login</h2>
                  <p className="text-gray-500">Enter your details to continue</p>
              </div>

              <div className="space-y-4">
                  <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isLoading ? 'Logging in...' : 'Login'}
                  </button>

                  {message && (
                    <Alert variant={message.includes('successful') ? 'default' : 'destructive'}>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">
                          New Employee?{' '}
                          <Link to="/register" className="text-blue-600 hover:underline">
                              Register here
                          </Link>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default LoginPage;
