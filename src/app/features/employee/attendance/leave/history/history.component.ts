import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveServices } from '../../../../../core/services/leave.service';
import { GetLeaveStatus, GetLeavePerHistory } from '../../../../../core/models/leave.model';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  private readonly leaveServices = inject(LeaveServices);

  leaveList: GetLeaveStatus[] = [];
  filteredList: GetLeaveStatus[] = [];
  searchTerm = '';
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

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredList = !term
      ? this.leaveList
      : this.leaveList.filter(l =>
          l.Emp_Id?.toLowerCase().includes(term) ||
          l.Leave_Type?.toLowerCase().includes(term) ||
          l.Reason?.toLowerCase().includes(term) ||
          l.LStatus?.toLowerCase().includes(term)
        );
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
    // StusClr comes from backend but fall back on LStatus text
    const status = record.LStatus?.toLowerCase() ?? '';
    if (status.includes('approve')) return 'badge bg-success-subtle text-success';
    if (status.includes('reject')) return 'badge bg-danger-subtle text-danger';
    return 'badge bg-warning-subtle text-warning';
  }
}