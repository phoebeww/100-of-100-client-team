const CLIENT_SERVICE_API_BASE_URL = 'https://coms-4156-client-backend.ue.r.appspot.com/';

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
  EmployeeInfo,
  ShiftResponse,
  AddShiftResponse,
  RemoveShiftResponse
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
      }
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response Body:', data);
    return {data, status: response.status};
  }

  // Auth endpoints (using CLIENT_SERVICE_API_BASE_URL)
  static async login(employeeId: string, name: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', 'POST', CLIENT_SERVICE_API_BASE_URL, {eid: employeeId, name: name});
  }

  static async registerEmployee(firstName: string, lastName: string, departmentId: number, hireDate: string,
                                position: string): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>(
      '/register', 'POST', CLIENT_SERVICE_API_BASE_URL, {firstName, lastName, departmentId, hireDate, position});
  }

  // Organization endpoints (using SERVICE_API_BASE_URL)
  static async getOrgInfo(clientId: string): Promise<ApiResponse<Organization>> {
    return this.request<Organization>('/getOrgInfo', 'GET', CLIENT_SERVICE_API_BASE_URL, {cid: clientId});
  }

  // Department endpoints (using SERVICE_API_BASE_URL)
  static async getDepartmentInfo(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentInfo>> {
    return this.request<DepartmentInfo>('/getDeptInfo', 'GET', CLIENT_SERVICE_API_BASE_URL, {cid: clientId, did: departmentId});
  }

  static async getDepartmentBudgetStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentBudgetStats>> {
    return this.request<DepartmentBudgetStats>('/statDeptBudget', 'GET', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPerfStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPerfStats>> {
    return this.request<DepartmentPerfStats>('/statDeptPerf', 'GET', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async getDepartmentPosStats(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentPosStats>> {
    return this.request<DepartmentPosStats>('/statDeptPos', 'GET', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString()
    });
  }

  static async setDepartmentHead(
    clientId: string,
    departmentId: number,
    employeeId: number
  ): Promise<ApiResponse<BasicResponse>> {
    return this.request<BasicResponse>('/setDeptHead', 'PATCH', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    });
  }

  // Employee Endpoints (using SERVICE_API_BASE_URL)
  static async getEmployeeInfo(clientId: string, employeeId: number): Promise<ApiResponse<EmployeeInfo>> {
    return this.request<EmployeeInfo>('/getEmpInfo', 'GET', CLIENT_SERVICE_API_BASE_URL, {
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
    return this.request<EmployeeInfo>('/addEmpToDept', 'POST', CLIENT_SERVICE_API_BASE_URL, {
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
    return this.request<string>('/updateEmpInfo', 'PATCH', CLIENT_SERVICE_API_BASE_URL, {
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
    return this.request<BasicResponse>('/removeEmpFromDept', 'DELETE', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      did: departmentId.toString(),
      eid: employeeId.toString()
    });
  }

  static async getShifts(clientId: string): Promise<ApiResponse<ShiftResponse>> {
    return this.request('/getShift', 'GET', CLIENT_SERVICE_API_BASE_URL, { cid: clientId });
  }

  static async addShift(clientId: string, employeeId: number, dayOfWeek: number, timeSlot: number): Promise<ApiResponse<AddShiftResponse>> {
    return this.request<AddShiftResponse>('/addShift', 'POST', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      employeeId: employeeId,
      dayOfWeek: dayOfWeek,
      timeSlot: timeSlot
    });
  }

  static async removeShift(clientId: string, employeeId: number, dayOfWeek: number, timeSlot: number): Promise<ApiResponse<RemoveShiftResponse>>{
    return this.request('/removeShift', 'DELETE', CLIENT_SERVICE_API_BASE_URL, {
      cid: clientId,
      employeeId,
      dayOfWeek,
      timeSlot
    });
  }

}

export default ApiService;