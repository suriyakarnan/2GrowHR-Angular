import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { EmpName, Employee, Division } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apiService: ApiService) {}

  getEmployeeByOrg(
    orgId: number,
    status: number = 0,
  ): Observable<Employee[]> {
    const url = `api/Employee/List?orgId=${orgId}&st=${status}`;
    return this.apiService
      .get<EmpName[]>(url)
      .pipe(map((data: EmpName[]) => data.map(this.mapToEmployee)));
  }

  getEmployeesByDivision(
    orgId: number,
    divisionId: number,
  ): Observable<Employee[]> {
    const url = `api/Employee/ListByDivision?orgId=${orgId}&div=${divisionId}`;
    return this.apiService
      .get<EmpName[]>(url)
      .pipe(map((data: EmpName[]) => data.map(this.mapToEmployee)));
  }

  getDivisions(orgId: number): Observable<Division[]> {
    const url = `api/Employee/Divisions?orgId=${orgId}`;
    return this.apiService.get<Division[]>(url);
  }

  private mapToEmployee(item: EmpName): Employee {
    return {
      id: item.empid,
      empCode: item.emp_Code,
      name: [item.name, item.mName, item.lName].filter((n) => !!n).join(' '),
      needsSalaryUpdate: item.cnt === 0,
    };
  }
}
