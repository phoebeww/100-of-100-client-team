import {useState, useEffect} from 'react';
import {Users, Search, Plus, Filter, ArrowUpDown} from 'lucide-react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import ApiService from '../../services/api';
import type {Employee, Department} from '../../types/apiResponses';
import {Link} from "react-router-dom";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const clientId = localStorage.getItem('clientId');
      if (!clientId) {
        setError('No client ID found');
        setLoading(false);
        return;
      }

      try {
        // First get organization info to get departments
        const orgResponse = await ApiService.getOrgInfo(clientId);
        if (orgResponse.status === 200) {
          setDepartments(orgResponse.data.departments);

          // Get detailed info for each department
          const departmentDetailsPromises = orgResponse.data.departments.map(dept =>
            ApiService.getDepartmentInfo(clientId, dept.id)
          );

          const deptResponses = await Promise.all(departmentDetailsPromises);
          console.log(deptResponses);

          // Combine all employees from all departments
          const allEmployees = deptResponses.reduce((acc, response, index) => {
            if (response.status === 200) {
              const deptId = orgResponse.data.departments[index].id;
              const deptName = orgResponse.data.departments[index].name;
              const deptEmployees = response.data.employees.map(emp => ({
                ...emp,
                department: deptName,
                departmentId: deptId
              }));
              return [...acc, ...deptEmployees];
            }
            return acc;
          }, [] as Employee[]);

          setEmployees(allEmployees);
        } else {
          setError('Failed to fetch organization data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({key, direction});
  };

  const sortEmployees = (employeeList: Employee[]) => {
    if (!sortConfig) return employeeList;

    return [...employeeList].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle undefined or null values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;  // undefined values go last
      if (bValue === undefined) return -1;

      // Convert to strings for comparison if they're strings or numbers
      const aString = aValue.toString().toLowerCase();
      const bString = bValue.toString().toLowerCase();

      if (aString < bString) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee =>
    (filterDepartment === 'all' || employee.department === filterDepartment) &&
    (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedEmployees = sortEmployees(filteredEmployees);

  // Handle delete employee
  const handleDelete = async (employeeId: number, departmentId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      setError('No client ID found');
      return;
    }

    try {
      const response = await ApiService.removeEmployeeFromDepartment(
        clientId,
        departmentId,
        employeeId
      );
      console.log(response);
      if (response.status === 200) {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Error connecting to server');
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link to={`/employees/add`}>
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center">
            <Plus className="h-5 w-5 mr-2"/>
            Add Employee
          </button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5"/>
              <span>All Employees ({sortedEmployees.length})</span>
            </CardTitle>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <select
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="border-b">
                <th
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    <ArrowUpDown className="h-4 w-4"/>
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Position</span>
                    <ArrowUpDown className="h-4 w-4"/>
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4"
                >
                  <div className="flex items-center space-x-2">
                    <span>Department</span>
                  </div>
                </th>
                <th
                  className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('performance')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Performance</span>
                    <ArrowUpDown className="h-4 w-4"/>
                  </div>
                </th>
                <th
                  className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('salary')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Salary</span>
                    <ArrowUpDown className="h-4 w-4"/>
                  </div>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
              </thead>
              <tbody>
              {sortedEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{employee.name}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.position}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.department}</td>
                  <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        employee.performance >= 4 ? 'bg-green-100 text-green-800' :
                          employee.performance >= 3 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.performance.toFixed(1)}
                      </span>
                  </td>
                  <td className="py-3 px-4 text-right">${employee.salary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/employees/edit/${employee.id}`}>
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      </Link>
                      <button className="text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(employee.id, employee.departmentId)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {sortedEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400"/>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No employees found
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm
                    ? 'Try adjusting your search or filter to find what you\'re looking for.'
                    : 'Get started by adding a new employee.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesPage;