import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, DollarSign, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApiService from '../../services/api';
import type { Department } from '../../types/apiResponses';

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const clientId = localStorage.getItem('clientId');
      if (!clientId) {
        setError('No client ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getOrgInfo(clientId);
        if (response.status === 200) {
          setDepartments(response.data.departments || []);
          console.log(response.data.departments);
        } else {
          setError('Failed to fetch departments');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departments</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
          Add Department
        </button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card 
            key={dept.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/departments/${dept.id}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{dept.name}</CardTitle>
              <Building2 className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Employees</span>
                  </div>
                  <span className="font-medium">{dept.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Department Head</span>
                  </div>
                  <span className="font-medium">{dept.head || 'Not assigned'}</span>
                </div>
                <div className="flex items-center justify-end text-sm text-blue-600">
                  View Details 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No departments</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new department.</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;