import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { EmpInfo, EmployeeInfo } from '../models/employeeinfo.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeInfoService {
  constructor(private apiService: ApiService) {}

  getEmployeeInfo(
    orgId: number,
    empId: string,
    status: number = 0,
  ): Observable<EmployeeInfo> {
    const url = `api/EmployeeInfo/GetEmployeeInfo`;
    const body = { Org: orgId, St: status, EmpId: empId };
    return this.apiService
      .post<EmpInfo[]>(url, body)
      .pipe(map((data: EmpInfo[]) => this.mapToEmployeeInfo(data[0])));
  }

  private mapToEmployeeInfo(item: EmpInfo): EmployeeInfo {
    return {
      id: item.empid,
      empCode: item.emp_Code,
      salutation: item.salutation,
      firstName: item.name,
      lastName: item.lName,
      fullName: [item.salutation, item.name, item.mName, item.lName]
        .filter((n) => !!n)
        .join(' '),
      gender: item.gen,
      dob: item.dob,
      doj: item.doj,
      marital: item.marital,
      mobile: item.mobile,
      mobile2: item.mobile2,
      email: item.email,
      divisionName: item.division_Name,
      departmentName: item.dep_Name,
      designationName: item.designation_Name,
      cityId: item.city_Id,
      bloodGroup: item.bloodGrp,
      aadhaar: item.adhr,
      bank: item.bank,
      bankAc: item.bankAc,
      branchName: item.branchName,
      pan: item.pan,
      ifsc: item.ifc,
      addr1: item.addr,
      addr2: item.addr1,
      pincode: item.pincode,
      permAddr1: item.addr3,
      permAddr2: item.addr4,
      permPincode: item.pincode1,
    };
  }
}