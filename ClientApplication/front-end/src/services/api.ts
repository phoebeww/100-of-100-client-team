const API_BASE_URL = 'http://localhost:8080';
import {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  Organization,
  DepartmentInfo,
  DepartmentBudgetStats,
  DepartmentPerfStats,
  DepartmentPosStats,
  BasicResponse, EmployeeInfo
} from '../types/apiResponses.ts';

class ApiService {
  private static async request<T>(
    endpoint: string,
    method: string,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, String(params[key]))
      );
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method !== 'GET' && params ? {body: JSON.stringify(params)} : {})
    });

    const data = await response.json();
    return {data, status: response.status};
  }

  // Auth endpoints
  static async login(clientId: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', 'POST', {cid: clientId});
  }

  static async registerOrganization(name: string): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/register', 'POST', {name});
  }

  static async getOrgInfo(clientId: string): Promise<ApiResponse<Organization>> {
    return this.request<Organization>('/getOrgInfo', 'GET', {cid: clientId});
  }

  // Department endpoints
  static async getDepartmentInfo(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentInfo>> {
    return this.request<DepartmentInfo>('/getDeptInfo', 'GET', {cid: clientId, did: departmentId});
  }

  static async getDepartmentBudgetStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentBudgetStats>> {
    return this.request<DepartmentBudgetStats>('/statDeptBudget', 'GET', {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPerfStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPerfStats>> {
    return this.request<DepartmentPerfStats>('/statDeptPerf', 'GET', {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPosStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPosStats>> {
    return this.request<DepartmentPosStats>('/statDeptPos', 'GET', {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async setDepartmentHead(
    clientId: string,
    departmentId: number,
    employeeId: number
  ): Promise<ApiResponse<BasicResponse>> {
    return this.request<BasicResponse>('/setDeptHead', 'PATCH', {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    });
  }


  // Employee Endpoints
  static async getEmployeeInfo(clientId: string, employeeId: number): Promise<ApiResponse<EmployeeInfo>> {
    return this.request<EmployeeInfo>('/getEmpInfo', 'GET', {
      cid: clientId,
      eid: employeeId.toString()
    })
  }

  static async addEmployeeToDepartment(clientId: string, departmentId: number, name: string, hireDate: string,
                                       position: string = "", salary: number = 0, performance: number = 0
  ): Promise<ApiResponse<EmployeeInfo>> {
    return this.request<EmployeeInfo>('/addEmpToDept', 'POST', {
      cid: clientId,
      did: departmentId,
      name,
      hireDate,
      position,
      salary,
      performance,
    });
  }

  static async updateEmployeeInfo(clientId: string, employeeId: number,
                                  updates: {
                                    position?: string;
                                    salary?: number;
                                    performance?: number;
                                  }
  ): Promise<ApiResponse<string>> {
    return this.request<string>('/updateEmpInfo', 'PATCH', {
      cid: clientId,
      eid: employeeId.toString(),
      ...updates,
    });
  }

  static async removeEmployeeFromDepartment(clientId: string, departmentId: number, employeeId: number): Promise<ApiResponse<BasicResponse>> {
    return this.request<BasicResponse>('/removeEmpFromDept', 'DELETE', {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    })
  }


}

export default ApiService;