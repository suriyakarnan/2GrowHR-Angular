import { Component, OnInit, OnDestroy, 
          ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { SelectpickerDirective } from '../../../shared/components/selectpicker/selectpicker.directive';

export interface ApprovalStep {
  id: number;
  label: string;
  status: 'Completed' | 'Pending' | 'Not Started';
}

export interface Division {
  id: number;
  name: string;
}

@Component({
  selector: 'app-payrun-process',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SelectpickerDirective],
  templateUrl: './payrun-process.component.html',
  styleUrl: './payrun-process.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrunProcessComponent implements OnInit, OnDestroy {

  selectedDivision: string[] = [];
  selectedMonth: string = '';
  monthOptions: string[] = [];
  isInitiating: boolean = false;
  allCompleted: boolean = false;

  divisions: Division[] = [
    { id: 1, name: 'SAN MEDIA PRIVATE LIMITED & Co' },
    { id: 2, name: 'HR Division' },
    { id: 3, name: 'Finance Division' }
  ];

  approvalSteps: ApprovalStep[] = [
    { id: 1, label: 'Leave Approval',                     status: 'Completed' },
    { id: 2, label: 'Late Punch Approval',                status: 'Completed' },
    { id: 3, label: 'Attendance Regularization Approval', status: 'Completed' },
    { id: 4, label: 'Over Time Approval',                 status: 'Completed' },
    { id: 5, label: 'CompoOff Approval',                  status: 'Completed' },
    { id: 6, label: 'OnDuty Approval',                    status: 'Completed' },
    { id: 7, label: 'Work From Home Approval',            status: 'Completed' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildMonthOptions();
    this.setCurrentMonth();
    this.evaluateAllCompleted();
    this.cdr.markForCheck(); 
  }

  ngOnDestroy(): void {}

  private buildMonthOptions(): void {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const now = new Date();
  const currentYear = now.getFullYear();

  // ✅ Show all 12 months of the current year
  months.forEach(month => {
    this.monthOptions.push(`${month}-${currentYear}`);
  });
}

  private setCurrentMonth(): void {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const now = new Date();
  // ✅ "June-2026" — must match exactly what's in monthOptions[]
  this.selectedMonth = `${months[now.getMonth()]}-${now.getFullYear()}`;
}

  evaluateAllCompleted(): void {
    this.allCompleted = this.approvalSteps.every(s => s.status === 'Completed');
    this.cdr.markForCheck();
  }

 

  onOpenQA(): void {
    console.log('Payrun Q&A opened');
  }

  trackByStep(_: number, step: ApprovalStep): number {
    return step.id;
  }
}