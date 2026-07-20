import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  GetLeaveResponse,
  GetLeavePerHistoryResponse,
  GetLeaveTypeResponse,
  GetApplicableDaysResponse,
  GetLeaveDatesResponse,
  LeaveFormValidatePayload,
  LeaveFormValidateResponse,
  LeaveFormPayload,
  LeaveFormResponse,
  GetUnapproveLeaveListResponse,
  GetLeaveApprovePerAppliResponse,
  LeaveApproveFinalSaveResponse
} from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveServices {
  private readonly apiService = inject(ApiService);

  private getEmployeeId() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      return JSON.parse(userStr).Sf_code || '';
    } catch {
      return '';
    }
  }

  GetLeaveStatus(): Observable<GetLeaveResponse> {
    const sfCode = this.getEmployeeId();

    return this.apiService.get<GetLeaveResponse>(
      `api/app/apipayroll/?axn=GetLeave_Status&sfCode=${sfCode}`,
    );
  }

  getLeavePerHistory(sl: number): Observable<GetLeavePerHistoryResponse> {
    const sfCode = this.getEmployeeId();
    return this.apiService.get<GetLeavePerHistoryResponse>(
      `api/app/apipayroll/?sl=${sl}&axn=GetLeave_Perhistory&sfCode=${sfCode}`,
    );
  }

  getLeaveType(): Observable<GetLeaveTypeResponse> {
    const sfCode = this.getEmployeeId();
    return this.apiService.get<GetLeaveTypeResponse>(
      `api/app/apipayroll/?sfCode=${sfCode}&axn=LeaveType`
    );
  }

  getApplicableDays(leaveId: number, empId: string): Observable<GetApplicableDaysResponse> {
    return this.apiService.get<GetApplicableDaysResponse>(
      `api/app/apipayroll/?axn=GetApplicableDays&Leave_Id=${leaveId}&EmpId=${empId}`
    );
  }

  getLeaveDates(fDate: string, lDate: string, slno: number, empId: string): Observable<GetLeaveDatesResponse> {
    return this.apiService.get<GetLeaveDatesResponse>(
      `api/app/apipayroll/?l_Date=${lDate}&slno=${slno}&axn=GetLeaveDates&sfCode=${empId}&f_Date=${fDate}`
    );
  }

  validateLeaveForm(payload: LeaveFormValidatePayload): Observable<LeaveFormValidateResponse> {
    const sfCode = this.getEmployeeId();
    const data = encodeURIComponent(JSON.stringify(payload));
    return this.apiService.get<LeaveFormValidateResponse>(
      `api/app/apipayroll/?sfCode=${sfCode}&axn=LeaveFormValidate&data=${data}`
    );
  }

  submitLeaveForm(payload: Omit<LeaveFormPayload, 'sfCode'>): Observable<LeaveFormResponse> {
    const sfCode = this.getEmployeeId();
    const body: LeaveFormPayload = { ...payload, sfCode };
    return this.apiService.post<LeaveFormResponse>(
      `api/app/apipayroll/?axn=LeaveForm`,
      body
    );
  }

  getUnapproveLeaveList(): Observable<GetUnapproveLeaveListResponse> {
    const sfCode = this.getEmployeeId();
    return this.apiService.get<GetUnapproveLeaveListResponse>(
      `api/app/apipayroll/?axn=UnapproveLeavelist&sfCode=${sfCode}`
    );
  }

  getLeaveApprovePerAppli(sl: number): Observable<GetLeaveApprovePerAppliResponse> {
    const sfCode = this.getEmployeeId();
    return this.apiService.get<GetLeaveApprovePerAppliResponse>(
      `api/app/apipayroll/?sfCode=${sfCode}&axn=LeaveapprovePerAppli&sl=${sl}`
    );
  }

  leaveApproveFinalSave(currentUser: string, sl: number): Observable<LeaveApproveFinalSaveResponse> {
  const sfCode = this.getEmployeeId();
  return this.apiService.get<LeaveApproveFinalSaveResponse>(
    `api/app/apipayroll/?axn=LeaveapproveFinalsave&sfCode=${sfCode}&CurrentUser=${currentUser}&sl=${sl}`
  );
}
}
