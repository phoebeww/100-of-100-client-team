import { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Users, Plus, Edit, Trash, ArrowLeft} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApiService from '../../services/api';
import type { Employee, DepartmentInfo } from '../../types/apiResponses';

const EditDepartmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<DepartmentInfo | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHead, setSelectedHead] = useState<number | null>(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      const clientId = localStorage.getItem('clientId');
      if (!clientId) {
        setError('No client ID found');
        setLoading(false);
        return;
      }

      try {
        // Fetch department details
        const deptResponse = await ApiService.getDepartmentInfo(clientId, parseInt(id || '', 10));
        if (deptResponse.status === 200) {
          setDepartment(deptResponse.data);
          setEmployees(deptResponse.data.employees || []);
          setSelectedHead(deptResponse.data.headId || null);
        } else {
          setError('Failed to fetch department data');
        }
      } catch (err) {
        console.log(err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [id]);

  const handleSetDepartmentHead = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId || !selectedHead) {
      setError('Please select a department head');
      return;
    }

    try {
      const response = await ApiService.setDepartmentHead(
        clientId,
        parseInt(id || '', 10),
        selectedHead
      );
      if (response.status === 200) {
        setError(null);
        alert('Department head updated successfully');
      } else {
        setError('Failed to set department head');
      }
    } catch (err) {
      console.log(err);
      setError('Error connecting to server');
    }
  };

  const handleAddEmployee = () => {
    navigate(`/employees/add`, { state: { departmentId: id } });
  };

  const handleEditEmployee = (employeeId: number) => {
    navigate(`/employees/edit/${employeeId}`, { state: { origin: 'department', departmentId: id } });
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      setError('No client ID found');
      return;
    }

    try {
      const response = await ApiService.removeEmployeeFromDepartment(
        clientId,
        parseInt(id || '', 10),
        employeeId
      );
      if (response.status === 200) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      console.log(err);
      setError('Error connecting to server');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading department details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          to={`/departments/${id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1"/>
          Back to Department Details
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 ml-2">Edit Department</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department Head</label>
              <select
                value={selectedHead || ''}
                onChange={(e) => setSelectedHead(parseInt(e.target.value, 10))}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select a head</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSetDepartmentHead}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center"
              >
                Save Head
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ml-2">Employees in Department</h2>
        <button
          onClick={handleAddEmployee}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2"/>
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <Card key={emp.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{emp.name}</CardTitle>
              <Users className="h-5 w-5 text-gray-500"/>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Position: {emp.position}</p>
                <p className="text-sm text-gray-500">Salary: ${emp.salary.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Performance: {emp.performance}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditEmployee(emp.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4 inline mr-1"/>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-4 w-4 inline mr-1"/>
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400"/>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No employees in this department</h3>
          <p className="mt-1 text-gray-500">Get started by adding a new employee.</p>
        </div>
      )}
    </div>
  );
};

export default EditDepartmentPage;
