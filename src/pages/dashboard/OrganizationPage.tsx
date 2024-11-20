import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ApiService from "../../services/api";
import { 
  Department, 
  Employee, 
  DepartmentInfo, 
  Organization 
} from '../../types/apiResponses';
import DepartmentStats from './OrganizationStats';


interface Stats {
  budget: any;
  performance: any;
  positions: any;
}

const DepartmentsPage = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState<DepartmentInfo | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = localStorage.getItem('clientId');

  useEffect(() => {
    fetchOrganizationInfo();
  }, []);

  const fetchOrganizationInfo = async () => {
    if (!clientId) {
      setError('No client ID found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const response = await ApiService.getOrgInfo(clientId);
      
      if (response.status === 200) {
        console.log('Organization data:', response.data);
        setOrganization(response.data);
        setDepartments(response.data.departments || []);
        setError(null);
      } else {
        setError('Failed to fetch organization data');
      }
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentDetails = async (deptId: number) => {
    if (!clientId) {
      setError('No client ID found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      // Fetch department info
      const deptInfoRes = await ApiService.getDepartmentInfo(clientId, deptId);
      
      if (deptInfoRes.status === 200) {
        setSelectedDeptInfo(deptInfoRes.data);
        setEmployees(deptInfoRes.data.employees || []);
        setSelectedDept(deptId);

        // Fetch department statistics
        const [budgetStats, perfStats, posStats] = await Promise.all([
          ApiService.getDepartmentBudgetStats(clientId, deptId),
          ApiService.getDepartmentPerfStats(clientId, deptId),
          ApiService.getDepartmentPosStats(clientId, deptId)
        ]);

        setStats({
          budget: budgetStats.data,
          performance: perfStats.data,
          positions: posStats.data
        });

        setError(null);
      } else {
        setError('Failed to fetch department details');
      }
    } catch (err) {
      console.error('Error fetching department details:', err);
      setError('Failed to load department details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {organization?.name || 'Loading...'}
          </h1>
          <p className="mt-2 text-gray-600">Department Management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Department List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Department List</CardTitle>
              </CardHeader>
              <CardContent>
                {departments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No departments found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => fetchDepartmentDetails(dept.id)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          selectedDept === dept.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 mr-3" />
                          <div>
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-sm text-gray-500">
                              Head: {dept.head || 'Not assigned'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dept.employeeCount} employees
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Department Details */}
          <div className="lg:col-span-3">
            {selectedDeptInfo ? (
              <div className="space-y-6">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedDeptInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Department Head</p>
                        <p className="mt-1">{selectedDeptInfo.head || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Employees</p>
                        <p className="mt-1">{employees.length}</p>
                      </div>
                      {stats?.budget && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Budget</p>
                          <p className="mt-1">${stats.budget.total?.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>


                      
                {/* Department Stats */}
                {clientId && selectedDept && (
                  <DepartmentStats 
                    clientId={clientId}
                    departmentId={selectedDept}
                  />
                )}

                {/* Employee Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Position</th>
                            <th className="px-4 py-2 text-right">Performance</th>
                            <th className="px-4 py-2 text-right">Salary</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {employees.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                No employees found in this department
                              </td>
                            </tr>
                          ) : (
                            employees.map((employee) => (
                              <tr key={employee.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{employee.name}</td>
                                <td className="px-4 py-2 text-gray-500">
                                  {employee.position}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  {employee.performance.toFixed(1)}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  ${employee.salary.toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No department selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a department from the list to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;