import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { TableDatatableDirective } from '../../../shared/components/data-table/table-datatable.directive';
import { SelectpickerDirective } from '../../../shared/components/selectpicker/selectpicker.directive'; 


interface Employee {
  id: string;
  name: string;
  deactivated: boolean;
}

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableDatatableDirective, SelectpickerDirective],
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.css']
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: Employee[] = [];
  selectedDivision: string[] = []; 


 


  ngOnInit(): void {
    this.employees = [
      { id: '0606', name: 'Sha K', deactivated: false },
      { id: '10001', name: 'Viknesh H H', deactivated: false },
      { id: '115', name: 'Was', deactivated: false },
      { id: '116', name: 'Is S S', deactivated: false },
      { id: '2406', name: 'Anbarasan', deactivated: false },
      { id: '52025', name: 'Vijay K', deactivated: true },
      { id: '52025', name: 'Vijay K', deactivated: true }
    ];
  }
}