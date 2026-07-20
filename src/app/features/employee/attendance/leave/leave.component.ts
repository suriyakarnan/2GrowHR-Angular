import { Component, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css',
})
export class LeaveComponent implements OnInit {
  private readonly leaveServices = inject(LeaveServices);
  private readonly router = inject(Router);

  // true when we're on the default 'leave-form' segment -> show the form inline
  isLeaveFormRoute = true;

  // ---- Leave Form state ----
  leaveTypes: LeaveType[] = [];
  selectedLeaveTypeId: number | null = null;
  fromDate = '';
  toDate = '';
  applicableDays: ApplicableDays[] = [];
  leaveDates: LeaveDate[] = [];
  dayTypeSelections: Record<string, string> = {}; // date -> dayType
  reason = '';
  selectedFile: File | null = null;
  totalDays = 0;
  isSubmitting = false;
  validationMsg = '';

  // Leave balance (right rail) — reused from leaveTypes' Balance field
  get leaveBalanceList(): LeaveType[] {
    return this.leaveTypes;
  }

  ngOnInit(): void {
    this.trackActiveRoute();
    this.loadLeaveTypes();
  }

  // Keep leave-form vs history in sync with the URL, same as full-final-settlement
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
        if (res.success) this.leaveTypes = res.Data;   // capital D
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
    this.calculateTotalDays();
  }

  calculateTotalDays(): void {
    // Full Day = 1, Half Day = 0.5 — adjust if backend sends different unit tokens
    this.totalDays = this.leaveDates.reduce((sum, d) => {
      const type = this.dayTypeSelections[d.Date];
      if (type === 'Full Day') return sum + 1;
      if (type === 'Half Day') return sum + 0.5;
      return sum; // 'No Leave' contributes 0
    }, 0);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  clearAll(): void {
    this.selectedLeaveTypeId = null;
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

    // NOTE: `File` is typed as string in LeaveFormPayload — confirm with Postman
    // whether the backend expects base64 here, or whether this endpoint actually
    // needs postForm() with multipart, like your uploadDocumentFile() work.
    const payload: Omit<LeaveFormPayload, 'sfCode'> = {
      Reason: this.reason,
      Leave_Type_Id: this.selectedLeaveTypeId!,
      From_Date: this.fromDate,
      To_Date: this.toDate,
      Leave_Type: leaveType?.LeaveType ?? '',
      Apply_Days: String(this.totalDays),
      Balance_Days: String(leaveType?.Balance ?? ''),
      Available_Days: String(leaveType?.Balance ?? ''),
      File: '', // populate once upload approach is confirmed
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
}
