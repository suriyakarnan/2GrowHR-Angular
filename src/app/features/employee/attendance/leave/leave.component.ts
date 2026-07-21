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

  // ADD — references to the two selectpicker directive instances via exportAs
  @ViewChild('leaveTypePicker') leaveTypePicker?: SelectpickerDirective;
  @ViewChild('employeePicker') employeePicker?: SelectpickerDirective;

  isLeaveFormRoute = true;

  // ---- Leave Form state ----
  leaveTypes: LeaveType[] = [];
  selectedLeaveTypeId: number | null = null;

  // ADD — employee dropdown state
  // ⚠️ Placeholder type — replace `any` with your real Employee model once confirmed
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

  get leaveBalanceList(): LeaveType[] {
    return this.leaveTypes;
  }

  ngOnInit(): void {
    this.trackActiveRoute();
    this.loadLeaveTypes();
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

  loadLeaveTypes(): void {
    this.leaveServices.getLeaveType().subscribe({
      next: (res) => {
        if (res.success) {
          this.leaveTypes = res.Data;
          // FIX — options were built by the directive before this data arrived.
          // Wait a tick for *ngFor to render the new <option> elements, then
          // tell the directive to re-read the native <select> and rebuild its list.
          setTimeout(() => this.leaveTypePicker?.refresh());
        }
      },
    });
  }

  // ADD — mirrors loadLeaveTypes(). Replace the service call with your real one.
  loadEmployees(): void {
    // ⚠️ TODO: confirm actual method name/service, e.g.:
    // this.leaveServices.getEmployeeList().subscribe({ ... })
    // or a dedicated EmployeeService if one exists in core/services.
    //
    // this.leaveServices.getEmployeeList().subscribe({
    //   next: (res) => {
    //     if (res.success) {
    //       this.employees = res.Data;
    //       setTimeout(() => this.employeePicker?.refresh());
    //     }
    //   },
    // });
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
    this.calculateTotalDays();
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

  clearAll(): void {
    this.selectedLeaveTypeId = null;
    this.selectedEmployeeId = null;
    this.fromDate = '';
    this.toDate = '';
    this.applicableDays = [];
    this.leaveDates = [];
    this.dayTypeSelections = {};
    this.reason = '';
    this.selectedFile = null;
    this.totalDays = 0;
    this.validationMsg = '';
  }

  apply(): void {
    if (
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
      date: d.Date,
      interval: '',
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
          this.clearAll();
          this.router.navigate(['/leave/history']);
        }
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
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