const API_BASE_URL = 'http://localhost:8080';
const AUTH_BASE_URL = 'http://localhost:8081';

import {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  Organization,
  DepartmentInfo,
  DepartmentBudgetStats,
  DepartmentPerfStats,
  DepartmentPosStats,
  BasicResponse,
  EmployeeInfo
} from '../types/apiResponses.ts';

class ApiService {
  private static async request<T>(
    endpoint: string,
    method: string,
    baseUrl: string,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${baseUrl}${endpoint}`);

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

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response Body:', data);
    return {data, status: response.status};
  }

  // Auth endpoints (using AUTH_BASE_URL)
  static async login(employeeId: string, name: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', 'POST', AUTH_BASE_URL, {eid: employeeId, name: name});
  }

  static async registerEmployee(firstName: string, lastName: string, departmentId: number, hireDate: string,
                                position: string): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>(
      '/register', 'POST', AUTH_BASE_URL, {firstName, lastName, departmentId, hireDate, position});
  }

  // Organization endpoints (using API_BASE_URL)
  static async getOrgInfo(clientId: string): Promise<ApiResponse<Organization>> {
    return this.request<Organization>('/getOrgInfo', 'GET', AUTH_BASE_URL, {cid: clientId});
  }

  // Department endpoints (using API_BASE_URL)
  static async getDepartmentInfo(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentInfo>> {
    return this.request<DepartmentInfo>('/getDeptInfo', 'GET', API_BASE_URL, {cid: clientId, did: departmentId});
  }

  static async getDepartmentBudgetStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentBudgetStats>> {
    return this.request<DepartmentBudgetStats>('/statDeptBudget', 'GET', API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPerfStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPerfStats>> {
    return this.request<DepartmentPerfStats>('/statDeptPerf', 'GET', API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPosStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPosStats>> {
    return this.request<DepartmentPosStats>('/statDeptPos', 'GET', API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async setDepartmentHead(
    clientId: string,
    departmentId: number,
    employeeId: number
  ): Promise<ApiResponse<BasicResponse>> {
    return this.request<BasicResponse>('/setDeptHead', 'PATCH', API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    });
  }

  // Employee Endpoints (using API_BASE_URL)
  static async getEmployeeInfo(clientId: string, employeeId: number): Promise<ApiResponse<EmployeeInfo>> {
    return this.request<EmployeeInfo>('/getEmpInfo', 'GET', API_BASE_URL, {
      cid: clientId,
      eid: employeeId.toString()
    });
  }

  static async addEmployeeToDepartment(
    clientId: string,
    departmentId: number,
    name: string,
    hireDate: string,
    position: string = "",
    salary: number = 0,
    performance: number = 0
  ): Promise<ApiResponse<EmployeeInfo>> {
    return this.request<EmployeeInfo>('/addEmpToDept', 'POST', API_BASE_URL, {
      cid: clientId,
      did: departmentId,
      name,
      hireDate,
      position,
      salary,
      performance,
    });
  }

  static async updateEmployeeInfo(
    clientId: string,
    employeeId: number,
    updates: {
      position?: string;
      salary?: number;
      performance?: number;
    }
  ): Promise<ApiResponse<string>> {
    return this.request<string>('/updateEmpInfo', 'PATCH', API_BASE_URL, {
      cid: clientId,
      eid: employeeId.toString(),
      ...updates,
    });
  }

  static async removeEmployeeFromDepartment(
    clientId: string,
    departmentId: number,
    employeeId: number
  ): Promise<ApiResponse<BasicResponse>> {
    return this.request<BasicResponse>('/removeEmpFromDept', 'DELETE', API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    });
  }
}

export default ApiService;