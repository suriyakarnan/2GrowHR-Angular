import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableDatatableDirective } from '../../../../shared/components/data-table/table-datatable.directive';
import { SelectpickerDirective } from '../../../../shared/components/selectpicker/selectpicker.directive';
import { Employee, Division } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableDatatableDirective, SelectpickerDirective],
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.css']
})
export class EmployeeDirectoryComponent implements OnInit {
  @ViewChild('divisionPicker') divisionPicker!: SelectpickerDirective;

  employees: Employee[] = [];
  divisions: Division[] = [];
  selectedDivision: string = 'all';
  loading = false;
  errorMessage = '';
  orgId = 5;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.loadEmployees();
  }

  loadDivisions(): void {
    this.employeeService.getDivisions(this.orgId).subscribe({
      next: (data) => {
        this.divisions = data;
        setTimeout(() => {
          this.divisionPicker?.refresh();
        });
      },
      error: (err) => console.error('Failed to load divisions:', err)
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeByOrg(this.orgId).subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.errorMessage = 'Failed to load employee directory.';
        this.loading = false;
      }
    });
  }

  onDivisionChange(): void {
    if (!this.selectedDivision || this.selectedDivision === 'all') {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const divId = Number(this.selectedDivision);

    this.employeeService.getEmployeesByDivision(this.orgId, divId).subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: (err) => {
        console.error('Failed to load employees by division:', err);
        this.errorMessage = 'Failed to load employees for selected division.';
        this.loading = false;
      }
    });
  }
}