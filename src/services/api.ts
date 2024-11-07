const API_BASE_URL = 'http://localhost:8080'; 

interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiService {
  private static async request<T>(
    endpoint: string,
    method: string,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add query parameters for GET requests
    if (method === 'GET' && params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, String(params[key]))
      );
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      // Add body for non-GET requests
      ...(method !== 'GET' && params ? { body: JSON.stringify(params) } : {})
    });

    const data = await response.json();
    return { data, status: response.status };
  }

  // Organization
  static async getOrgInfo(clientId: number) {
    return this.request('/getOrgInfo', 'GET', { cid: clientId });
  }

  // Department
  static async getDepartmentInfo(clientId: number, departmentId: number) {
    return this.request('/getDeptInfo', 'GET', { cid: clientId, did: departmentId });
  }

  static async getDepartmentBudgetStats(clientId: number, departmentId: number) {
    return this.request('/statDeptBudget', 'GET', { cid: clientId, did: departmentId });
  }

  static async getDepartmentPerfStats(clientId: number, departmentId: number) {
    return this.request('/statDeptPerf', 'GET', { cid: clientId, did: departmentId });
  }

  static async getDepartmentPosStats(clientId: number, departmentId: number) {
    return this.request('/statDeptPos', 'GET', { cid: clientId, did: departmentId });
  }

  static async setDepartmentHead(clientId: number, departmentId: number, employeeId: number) {
    return this.request('/setDeptHead', 'PATCH', { 
      cid: clientId, 
      did: departmentId, 
      eid: employeeId 
    });
  }

  // Employee
  static async getEmployeeInfo(clientId: number, employeeId: number) {
    return this.request('/getEmpInfo', 'GET', { cid: clientId, eid: employeeId });
  }

  static async setEmployeePerformance(clientId: number, employeeId: number, performance: number) {
    return this.request('/setEmpPerf', 'PATCH', {
      cid: clientId,
      eid: employeeId,
      performance
    });
  }

  static async setEmployeePosition(clientId: number, employeeId: number, position: string) {
    return this.request('/setEmpPos', 'PATCH', {
      cid: clientId,
      eid: employeeId,
      position
    });
  }

  static async setEmployeeSalary(clientId: number, employeeId: number, salary: number) {
    return this.request('/setEmpSalary', 'PATCH', {
      cid: clientId,
      eid: employeeId,
      salary
    });
  }

  static async addEmployeeToDepartment(
    clientId: number, 
    departmentId: number, 
    name: string, 
    hireDate: string
  ) {
    return this.request('/addEmpToDept', 'POST', {
      cid: clientId,
      did: departmentId,
      name,
      hireDate
    });
  }

  static async removeEmployeeFromDepartment(
    clientId: number,
    departmentId: number,
    employeeId: number
  ) {
    return this.request('/removeEmpFromDept', 'DELETE', {
      cid: clientId,
      did: departmentId,
      eid: employeeId
    });
  }
}

export default ApiService;