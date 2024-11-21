import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import type { Department } from '../../types/apiResponses';

const AddEmployeePage = () => {
  const [name, setName] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [performance, setPerformance] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleAdd = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      setError('No client ID found');
      return;
    }

    try {
      const response = await ApiService.addEmployeeToDepartment(
        clientId,
        parseInt(departmentId, 10), // Convert to number
        name,
        hireDate,
        position,
        parseFloat(salary),
        parseFloat(performance)
      );
      console.log(position);
      console.log(salary);
      console.log(performance);
      console.log(response);
      if (response.status === 201) {
        navigate('/employees'); // Redirect back to employees page
      } else {
        setError('Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      setError('Error connecting to server');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Hire Date</label>
        <input
          type="date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Position</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Salary</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Performance</label>
        <input
          type="number"
          value={performance}
          onChange={(e) => setPerformance(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        />
        <label className="block mb-2">Department</label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center mr-3"
        >
          Add Employee
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

export default AddEmployeePage;
