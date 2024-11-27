// types/apiResponses.ts

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface LoginResponse {
  status: string;
  message: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  token: string;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  performance: number;
  salary: number;
  department?: string;
  departmentId: number;
}

export interface Department {
  id: number;
  name: string;
  head: string;
  employeeCount: number;
  employees?: Employee[]; 
}

export interface Organization {
  id: number;
  name: string;
  departments: Department[];
  departments_id: number[];
}

export interface DepartmentInfo {
  id: number;
  name: string;
  head: string;
  headId: number;
  employees: Employee[];
}

export interface DepartmentBudgetStats {
  total: number;
  average: number;
  highest: number;
  lowest: number;
  highestEmployee: number | null;
  lowestEmployee: number | null;
}

export interface DepartmentPerfStats {
  highest: number;
  percentile25: number;
  median: number;
  percentile75: number;
  lowest: number;
  average: number;
  sortedEmployeeIds: number[];
}

export interface DepartmentPosStats {
  [key: string]: number;
}

export interface EmployeeInfo {
  id: number;
  name: string;
  department: string;
  position: string;
  salary: number;
  performance: number;
  hireDate: string;
}

export interface DepartmentStats {
  budgetStats: DepartmentBudgetStats;
  perfStats: DepartmentPerfStats;
  posStats: DepartmentPosStats;
}

export interface BasicResponse {
  status: string;
  message: string;
}

// shift management types

export interface TimeSlotInfo {
  timeSlot: string;
  timeRange: string;
}

export interface ShiftInfo {
  employeeId: number;
  employeeName: string;
  timeSlot: string;
  timeRange: string;
}

export interface ShiftSchedule {
  [key: string]: ShiftInfo[];
}

export interface ShiftResponse {
  status: string;
  schedule: ShiftSchedule;
  availableSlots: {
    [key: string]: TimeSlotInfo[];
  };
}

export interface AddShiftResponse {
  status: string;
  message: string;
  employeeName: string;
  dayOfWeek: string;
  timeSlot: string;
}

export interface RemoveShiftResponse {
  status: string;
  message: string;
  employeeName: string;
  dayOfWeek: string;
  timeSlot: string;
}