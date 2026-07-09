import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// TODO: confirm this relative path matches where the directive actually lives
// relative to this component's folder.
import { TableDatatableDirective } from '../../../../shared/components/data-table/table-datatable.directive';

interface ResignationStatus {
  employeeId: string;
  employeeName: string;
  status: 'Approved' | 'Pending';
  initiatedDate: string;
}

@Component({
  selector: 'app-resignation-status',
  standalone: true,
  imports: [CommonModule, TableDatatableDirective],
  templateUrl: './resignation-status.component.html',
  styleUrl: './resignation-status.component.css'
})
export class ResignationStatusComponent implements OnInit {
  resignations: ResignationStatus[] = [];

  ngOnInit(): void {
    // Mock data matching the screenshot — swap this block for a real
    // service call (e.g. this.resignationService.getAll()) when the API
    // is ready. At that point, add `implements OnDestroy`, store the
    // subscription, and unsubscribe in ngOnDestroy() to avoid leaks —
    // that's the seam mentioned above.
    this.resignations = [
      { employeeId: 'SA/SE/Finance/xx011', employeeName: 'ASD',        status: 'Approved', initiatedDate: '04/02/2026' },
      { employeeId: 'SEF0082',              employeeName: 'SELVAKUMAR', status: 'Approved', initiatedDate: '09/10/2024' },
      { employeeId: '114',                  employeeName: 'RRR',        status: 'Pending',  initiatedDate: '09/10/2024' },
      { employeeId: 'SITCO001',             employeeName: 'BALBIR',     status: 'Approved', initiatedDate: '13/06/2025' },
      { employeeId: 'EMP007',               employeeName: 'AMIT',       status: 'Approved', initiatedDate: '13/06/2025' },
      { employeeId: 'SA/DEO/Admin/xx012',   employeeName: 'VALENTINE',  status: 'Approved', initiatedDate: '14/10/2024' },
      { employeeId: '2406',                 employeeName: 'ANBARASAN',  status: 'Approved', initiatedDate: '14/10/2024' },
      { employeeId: 'SEF050',               employeeName: 'KAVIPRIYA',  status: 'Pending',  initiatedDate: '17/04/2026' }
    ];
  }

  onViewTimeline(row: ResignationStatus): void {
    // Hook for opening the status-timeline modal/drawer for this row.
    console.log('View timeline for', row.employeeId);
  }
}