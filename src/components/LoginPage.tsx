import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ApiResponse, LoginResponse } from '../types/apiResponses';
import ApiService from '../services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginPageProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
    const [uniqueId, setUniqueId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!uniqueId.trim()) {
            setMessage('Please enter your unique ID');
            return;
        }

        setIsLoading(true);
        try {
            const response: ApiResponse<LoginResponse> = await ApiService.login(uniqueId);
            if (response.status === 200 && response.data.status === 'success') {
                setIsAuthenticated(true);
                setMessage(response.data.message);
            } else {
                setMessage('Login failed. Please check your ID and try again.');
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
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-gray-500">Enter your organization's unique ID to continue</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Enter your unique ID"
                            value={uniqueId}
                            onChange={(e) => setUniqueId(e.target.value)}
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
                            Don't have a unique ID?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Register your organization
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;