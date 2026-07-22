import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveServices } from '../../../../../core/services/leave.service';
import { GetLeaveStatus, GetLeavePerHistory } from '../../../../../core/models/leave.model';

import { SelectpickerDirective } from '../../../../../shared/components/selectpicker/selectpicker.directive';
import { DateRangePickerDirective } from '../../../../../shared/components/datepicker/date-range-picker.directive';
import { TableDatatableDirective } from '../../../../../shared/components/data-table/table-datatable.directive';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectpickerDirective,
    DateRangePickerDirective,
    TableDatatableDirective,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  private readonly leaveServices = inject(LeaveServices);

  leaveList: GetLeaveStatus[] = [];
  filteredList: GetLeaveStatus[] = [];
  isLoading = false;

  // per-record history modal state
  selectedHistory: GetLeavePerHistory[] = [];
  showHistoryModal = false;

  ngOnInit(): void {
    this.loadLeaveHistory();
  }

  loadLeaveHistory(): void {
    this.isLoading = true;
    this.leaveServices.GetLeaveStatus().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.leaveList = res.data;
          this.filteredList = res.data;
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Filters filteredList by From_Date falling within the picked range
  onDateRangeFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const [startStr, endStr] = value.split(' - ').map(s => s.trim());
    if (!startStr || !endStr) return;

    const start = this.parsePickerDate(startStr);
    const end = this.parsePickerDate(endStr);
    if (!start || !end) return;

    this.filteredList = this.leaveList.filter(rec => {
      const recFrom = this.parseRecordDate(rec.From_Date);
      return recFrom !== null && recFrom >= start && recFrom <= end;
    });
  }

  // Parses the DateRangePickerDirective's own output format: dd/mm/yyyy
  private parsePickerDate(ddmmyyyy: string): Date | null {
    if (!ddmmyyyy) return null;
    const [dd, mm, yyyy] = ddmmyyyy.split('/').map(Number);
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  }

  // Parses the backend's record date format: dd-mm-yyyy
  private parseRecordDate(ddmmyyyy: string): Date | null {
    if (!ddmmyyyy) return null;
    const [dd, mm, yyyy] = ddmmyyyy.split('-').map(Number);
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  }

  viewHistory(sl: number): void {
    this.leaveServices.getLeavePerHistory(sl).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedHistory = res.data;
          this.showHistoryModal = true;
        }
      }
    });
  }

  closeModal(): void {
    this.showHistoryModal = false;
    this.selectedHistory = [];
  }

  statusBadgeClass(record: GetLeaveStatus): string {
    const status = record.LStatus?.toLowerCase() ?? '';
    if (status.includes('approve')) return 'badge bg-success-subtle text-success';
    if (status.includes('reject')) return 'badge bg-danger-subtle text-danger';
    return 'badge bg-warning-subtle text-warning';
  }
}