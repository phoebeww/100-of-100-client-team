import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../../services/api.ts";
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
    const [hireDate, setHireDate] = useState('');
    const [position, setPosition] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch departments
    useEffect(() => {
        const fetchDepartments = async () => {
            const clientId = localStorage.getItem('clientId');
            if (!clientId) {
                setError('No client ID found');
                return;
            }

            try {
                const response = await ApiService.getOrgInfo(clientId);
                if (response.status === 200) {
                    setDepartments(response.data.departments);
                } else {
                    setError('Failed to fetch departments');
                }
            } catch (err) {
                console.error('Error fetching departments:', err);
                setError('Error connecting to server');
            }
        };

        fetchDepartments();
    }, []);

    // find employeeId
    interface ExtractEmployeeId {
        (message: string): string | null;
    }

    const extractEmployeeId: ExtractEmployeeId = (message) => {
        const match = message.match(/Employee \[(\d+)]/); // Match "Employee [12345]"
        return match ? match[1] : null; // Return the ID or null if not found
    };

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !departmentId || !hireDate.trim() || !position.trim()) {
            setMessage('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await ApiService.registerEmployee(firstName, lastName, parseInt(departmentId, 10), hireDate, position);
            const employeeId = extractEmployeeId(response.data.message);
            if (response.status === 201 && response.data.status === 'success') {
                setMessage(`Registration successful! Your employee ID is ${employeeId}.`);
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
          {/* Application Title */}
          <div className="text-center mb-6 mt-14">
              <h1 className="text-4xl font-extrabold text-gray-900">
                  HospitalTracker<sup className="text-lg">®</sup>
              </h1>
          </div>

          <div className="w-full max-w-md space-y-6">
              <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold">Register Employee</h2>
                  <p className="text-gray-500">Join as a new employee to your organization</p>
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
                  </div>
                  <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                          ))}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <input
                        type="date"
                        value={hireDate}
                        onChange={(e) => setHireDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <div className="text-center">
                      <p className="text-sm text-gray-500">
                          Want to go back?{' '}
                          <Link to="/" className="text-blue-600 hover:underline">
                              Return to Home
                          </Link>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    );

};

export default RegisterPage;
