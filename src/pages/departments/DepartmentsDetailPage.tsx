import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApiService from '../../services/api';
import type { DepartmentInfo } from '../../types/apiResponses';

const DepartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      const clientId = localStorage.getItem('clientId');
      if (!clientId || !id) {
        setError('Invalid department ID or client ID');
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getDepartmentInfo(clientId, parseInt(id));
        if (response.status === 200) {
          setDepartmentInfo(response.data);
        } else {
          setError('Failed to fetch department details');
        }
      } catch (err) {
        console.log(err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading department details...</p>
      </div>
    );
  }

  if (error || !departmentInfo) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error || 'Department not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link 
          to="/departments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Departments
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Building2 className="h-8 w-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold">{departmentInfo.name}</h1>
            <p className="text-gray-500">Department Head: {departmentInfo.head || 'Not assigned'}</p>
          </div>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => navigate(`/departments/${departmentInfo.id}/edit`)}>
          Edit Department
        </button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Employees</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Position</th>
                  <th className="text-right py-3 px-4">Performance</th>
                  <th className="text-right py-3 px-4">Salary</th>
                </tr>
              </thead>
              <tbody>
                {departmentInfo.employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{employee.name}</td>
                    <td className="py-3 px-4 text-gray-600">{employee.position}</td>
                    <td className="py-3 px-4 text-right">{employee.performance.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right">${employee.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetailPage;