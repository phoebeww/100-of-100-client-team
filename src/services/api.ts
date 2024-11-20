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
  BasicResponse
} from '../types/apiResponses';

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
      ...(method !== 'GET' && params ? { body: JSON.stringify(params) } : {})
    });

    const data = await response.json();
    return { data, status: response.status };
  }

  // Auth endpoints
  static async login(clientId: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', 'POST', { cid: clientId });
  }

  static async registerOrganization(name: string): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/register', 'POST', { name });
  }

static async getOrgInfo(clientId: string): Promise<ApiResponse<Organization>> {
  return this.request<Organization>('/getOrgInfo', 'GET', { cid: clientId });
}

  // Department endpoints
  static async getDepartmentInfo(clientId: string, departmentId: number): Promise<ApiResponse<DepartmentInfo>> {
    return this.request<DepartmentInfo>('/getDeptInfo', 'GET', { cid: clientId, did: departmentId });
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


}

export default ApiService;