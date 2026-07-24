import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { LeaveServices } from '../../../../core/services/leave.service';
import {
  LeaveType,
  ApplicableDays,
  LeaveDate,
  LeaveDateDetail,
  LeaveFormValidatePayload,
  LeaveFormPayload,
} from '../../../../core/models/leave.model';

import { SelectpickerDirective } from '../../../../shared/components/selectpicker/selectpicker.directive';
import { DatePickerDirective } from '../../../../shared/components/datepicker/date-picker.directive';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SelectpickerDirective,
    DatePickerDirective,
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css',
})
export class LeaveComponent implements OnInit {
  private readonly leaveServices = inject(LeaveServices);
  private readonly router = inject(Router);

  @ViewChild('leaveTypePicker') leaveTypePicker?: SelectpickerDirective;
  @ViewChild('employeePicker') employeePicker?: SelectpickerDirective;

  isLeaveFormRoute = true;

  halfDaySelections: Record<string, string> = {};

  leaveTypes: LeaveType[] = [];
  selectedLeaveTypeId: number | null = null;

  employees: any[] = [];
  selectedEmployeeId: string | null = null;

  fromDate = '';
  toDate = '';
  applicableDays: ApplicableDays[] = [];
  leaveDates: LeaveDate[] = [];
  dayTypeSelections: Record<string, string> = {};
  reason = '';
  selectedFile: File | null = null;
  totalDays = 0;
  isSubmitting = false;
  validationMsg = '';

  // ---- Toast state ----
  showSuccessToast = false;
  successMessage = '';

  get leaveBalanceList(): LeaveType[] {
    return this.leaveTypes;
  }

  ngOnInit(): void {
    this.trackActiveRoute();
    this.loadEmployees();
  }

  private trackActiveRoute(): void {
    this.isLeaveFormRoute = this.router.url.endsWith('/leave-form');
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isLeaveFormRoute = this.router.url.endsWith('/leave-form');
      });
  }

  loadEmployees(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const empId = user.sf_emp_id;
      const empName = (user.Sf_Name || '').trim();

      if (empId && empName) {
        this.employees = [{ id: empId, name: `${empName} (${empId})` }];
        this.selectedEmployeeId = empId;
        setTimeout(() => this.employeePicker?.refresh());
        this.onEmployeeChange();
      }
    } catch {
      this.employees = [];
    }
  }

  onEmployeeChange(): void {
    this.selectedLeaveTypeId = null;
    this.leaveTypes = [];
    this.resetDependentFormState();

    if (!this.selectedEmployeeId) return;
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveServices.getLeaveType().subscribe({
      next: (res) => {
        if (res.success) {
          this.leaveTypes = res.Data;
          setTimeout(() => this.leaveTypePicker?.refresh());
        }
      },
    });
  }

  onDateRangeChange(): void {
    if (!this.fromDate || !this.toDate || !this.selectedLeaveTypeId) return;
    const empId = this.getCurrentEmpId();

    this.leaveServices
      .getApplicableDays(this.selectedLeaveTypeId, empId)
      .subscribe({
        next: (res) => {
          if (res.success) this.applicableDays = res.Data;
        },
      });

    this.leaveServices
      .getLeaveDates(this.fromDate, this.toDate, 0, empId)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.leaveDates = res.Head;
            this.leaveDates.forEach(
              (d) => (this.dayTypeSelections[d.Date] = 'Full Day'),
            );
            this.calculateTotalDays();
          }
        },
      });
  }

  onDayTypeChange(date: string, value: string): void {
    this.dayTypeSelections[date] = value;

    if (value === 'Half Day') {
      this.halfDaySelections[date] =
        this.halfDaySelections[date] || 'First Half';
    } else {
      delete this.halfDaySelections[date];
    }

    this.calculateTotalDays();
  }

  onHalfDayChange(date: string, value: string): void {
    this.halfDaySelections[date] = value;
  }

  calculateTotalDays(): void {
    this.totalDays = this.leaveDates.reduce((sum, d) => {
      const type = this.dayTypeSelections[d.Date];
      if (type === 'Full Day') return sum + 1;
      if (type === 'Half Day') return sum + 0.5;
      return sum;
    }, 0);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  private resetDependentFormState(): void {
    this.fromDate = '';
    this.toDate = '';
    this.applicableDays = [];
    this.leaveDates = [];
    this.dayTypeSelections = {};
    this.halfDaySelections = {};
    this.reason = '';
    this.selectedFile = null;
    this.totalDays = 0;
    this.validationMsg = '';
  }

  clearAll(): void {
    this.selectedLeaveTypeId = null;
    this.selectedEmployeeId = null;
    this.leaveTypes = [];
    this.resetDependentFormState();
  }

  private resetToDefaultState(): void {
    this.selectedLeaveTypeId = null;
    this.leaveTypes = [];
    this.resetDependentFormState();
    this.loadEmployees();
  }

  apply(): void {
    if (
      !this.selectedEmployeeId ||
      !this.selectedLeaveTypeId ||
      !this.fromDate ||
      !this.toDate ||
      !this.reason
    ) {
      this.validationMsg = 'Please fill all required fields.';
      return;
    }

    const validatePayload: LeaveFormValidatePayload = {
      Leave_Type: this.selectedLeaveTypeId,
      LeavePart: 'Full Day',
      Apply_Days: String(this.totalDays),
      From_Date: this.fromDate,
      To_Date: this.toDate,
      LeaveStatus: 'Pending',
    };

    this.isSubmitting = true;
    this.leaveServices.validateLeaveForm(validatePayload).subscribe({
      next: (res) => {
        const msg = res.Response?.[0]?.Msg;
        if (msg && msg.toLowerCase() !== 'ok' && msg.trim() !== '') {
          this.validationMsg = msg;
          this.isSubmitting = false;
          return;
        }
        this.submitForm();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  private submitForm(): void {
    const leaveType = this.leaveTypes.find(
      (l) => l.id === this.selectedLeaveTypeId,
    );

    const dateDetails: LeaveDateDetail[] = this.leaveDates.map((d) => ({
      // FIX: d.Date arrives as "2026-07-23T00:00:00" from GetLeaveDates.
      // The backend SQL layer throws a conversion error on the full
      // timestamp, so only the date portion is sent.
      date: d.Date.split('T')[0],
      interval:
        this.dayTypeSelections[d.Date] === 'Half Day'
          ? this.halfDaySelections[d.Date]
          : '',
      dayType: this.dayTypeSelections[d.Date],
      dayTypeId:
        this.dayTypeSelections[d.Date] === 'Full Day'
          ? '1'
          : this.dayTypeSelections[d.Date] === 'Half Day'
            ? '2'
            : '0',
    }));

    const payload: Omit<LeaveFormPayload, 'sfCode'> = {
      Reason: this.reason,
      Leave_Type_Id: this.selectedLeaveTypeId!,
      From_Date: this.fromDate,
      To_Date: this.toDate,
      Leave_Type: leaveType?.LeaveType ?? '',
      Apply_Days: String(this.totalDays),
      Balance_Days: String(leaveType?.Balance ?? ''),
      Available_Days: String(leaveType?.Balance ?? ''),
      File: '',
      DateDetails: dateDetails,
    };

    this.leaveServices.submitLeaveForm(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.showToast('Leave applied successfully');
          this.resetToDefaultState();
        }
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  private showToast(message: string): void {
    this.successMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => (this.showSuccessToast = false), 3000);
  }

  private getCurrentEmpId(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      return JSON.parse(userStr).Sf_code || '';
    } catch {
      return '';
    }
  }

  onFromDateSelected(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    this.fromDate = this.toIsoDate(value);
    this.onDateRangeChange();
  }

  onToDateSelected(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    this.toDate = this.toIsoDate(value);
    this.onDateRangeChange();
  }

  private toIsoDate(ddmmyyyy: string): string {
    const [dd, mm, yyyy] = ddmmyyyy.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
}