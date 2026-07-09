import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableDatatableDirective } from '../../../../../shared/components/data-table/table-datatable.directive';
import { SelectpickerDirective } from '../../../../../shared/components/selectpicker/selectpicker.directive';

interface EmployeeDetail {
  slNo: number;
  employeeCode: string;
  employeeId: string;
  employeeName: string;
  gender: string;
  marital: string;
  doj: string;
  doc: string;
  reportingTo: string;
}

@Component({
  selector: 'app-detailed-view',
  standalone: true,
  imports: [CommonModule, TableDatatableDirective,  SelectpickerDirective, FormsModule],
  templateUrl: './detailed-view.component.html',
  styleUrl: './detailed-view.component.css'
})
export class DetailedViewComponent implements OnInit {
  employees: EmployeeDetail[] = [];
  selectedDivision: string = '';

  ngOnInit(): void {
    this.employees = [
      { slNo: 1, employeeCode: 'EMP87', employeeId: 'SEFM007', employeeName: 'Amit Kumar', gender: 'Male', marital: '', doj: '22/07/2019', doc: '-', reportingTo: '' },
      { slNo: 2, employeeCode: 'EMP18498', employeeId: '111', employeeName: 'Anis K', gender: 'Male', marital: 'Unmarried', doj: '25/08/2023', doc: '28/09/2023', reportingTo: 'Mnj' },
      { slNo: 3, employeeCode: 'EMP77', employeeId: 'SEF064', employeeName: 'Ashok', gender: 'Male', marital: '', doj: '02/01/2019', doc: '-', reportingTo: '' },
      { slNo: 4, employeeCode: 'EMP27105', employeeId: 'SA/PMR/Tech/xx015', employeeName: 'Athira M S', gender: 'Female', marital: 'Unmarried', doj: '01/08/2024', doc: '01/08/2024', reportingTo: '' },
      { slNo: 5, employeeCode: 'EMP69', employeeId: 'SEFM002', employeeName: 'Darious', gender: 'Male', marital: '', doj: '15/03/2013', doc: '-', reportingTo: '' },
      { slNo: 6, employeeCode: 'EMP62', employeeId: 'SEF042', employeeName: 'Indumathi d', gender: 'Female', marital: '', doj: '02/06/2017', doc: '-', reportingTo: '' }
    ];
  }
}