import React, { useState } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/api";
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage: React.FC = () => {
    const [clientName, setClientName] = useState('');
    const [message, setMessage] = useState('');
    const [showLoginLink, setShowLoginLink] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!clientName.trim()) {
            setMessage('Please enter your organization name');
            return;
        }

        setIsLoading(true);
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
            console.error(error);
            setMessage('Error: Unable to register. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Register Organization</h1>
                    <p className="text-gray-500">Create an account for your organization</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Enter Organization Name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                        />
                    </div>

                    <button 
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>

                    {message && (
                        <Alert variant={message.includes('successful') ? 'default' : 'destructive'}>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {showLoginLink && (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Registration complete! Please{' '}
                                <Link to="/" className="text-blue-600 hover:underline">
                                    login with your unique ID
                                </Link>
                            </p>
                        </div>
                    )}

                    {!showLoginLink && (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/" className="text-blue-600 hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;