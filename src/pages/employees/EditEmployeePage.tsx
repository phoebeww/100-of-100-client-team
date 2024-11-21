import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const EditEmployeePage = () => {
  const { id } = useParams<{ id: string }>(); // Get employee ID from URL params
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<{
    position: string;
    salary: number | null;
    performance: number | null;
  }>({
    position: '',
    salary: null,
    performance: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const clientId = localStorage.getItem('clientId');
      if (!clientId || !id) {
        setError('Missing client ID or employee ID');
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getEmployeeInfo(clientId, parseInt(id, 10));
        console.log(response);
        if (response.status === 200) {
          setEmployee({
            position: response.data.position || '',
            salary: response.data.salary || null,
            performance: response.data.performance || null,
          });
        } else {
          setError('Failed to fetch employee data');
        }
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
      console.log(employee);
    };

    fetchEmployeeData();
  }, [id]);

  const handleUpdate = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId || !id) {
      setError('Missing client ID or employee ID');
      return;
    }

    try {
      const response = await ApiService.updateEmployeeInfo(clientId, parseInt(id, 10), {
        position: employee.position,
        salary: employee.salary !== null ? employee.salary : undefined,
        performance: employee.performance !== null ? employee.performance : undefined,
      });

      if (response.status === 200) {
        navigate('/employees'); // Redirect to employees page after successful update
      } else {
        setError('Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Error connecting to the server');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block mb-2">Position</label>
        <input
          type="text"
          value={employee.position}
          onChange={(e) =>
            setEmployee((prev) => ({...prev, position: e.target.value}))
          }
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Salary</label>
        <input
          type="number"
          value={employee.salary !== null ? employee.salary : ''}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              salary: e.target.value ? parseFloat(e.target.value) : null,
            }))
          }
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Performance</label>
        <input
          type="number"
          value={employee.performance !== null ? employee.performance : ''}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              performance: e.target.value ? parseFloat(e.target.value) : null,
            }))
          }
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center mr-3"
        >
          Update
        </button>
        <button
          onClick={() => navigate('/employees')}
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors inline-flex items-center"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditEmployeePage;
