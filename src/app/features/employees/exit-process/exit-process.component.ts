import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TableDatatableDirective } from '../../../shared/components/data-table/table-datatable.directive';
import { SelectpickerDirective } from '../../../shared/components/selectpicker/selectpicker.directive'; 

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  exittype: string;
  initiateDate: string;
  lastWorkingDate: string;
}

@Component({
  selector: 'app-exit-process',
  standalone: true,
  imports: [CommonModule, FormsModule, TableDatatableDirective, SelectpickerDirective,],
  templateUrl: './exit-process.component.html',
  styleUrl: './exit-process.component.css'
})
export class ExitProcessComponent implements OnInit {
  employees: Employee[] = [];
  selectedDivision: string[] = []; 

  ngOnInit(): void {
    this.employees = [
      { id: 'SA/PMR/Tech/xx016', name: 'Akil', designation: 'Project Manager', department : 'Technical', exittype: 'Resigned', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'},
      { id: 'SEF0082', name: 'Selvakumar K', designation: 'Testing Engineer', department : 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'}, 
      { id: 'SITCO001', name: 'Selvakumar K', designation: 'Managing Director', department : 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'},
      { id: '2406', name: 'Anbarasan', designation: 'Project Manager', department : 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'},
      { id: 'EMP007', name: '	Amit  ', designation: 'SOFTWARE DEVELOPER', department : 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'},
      { id: 'SA/SE/Finance/xx011', name: 'Vijay K', designation: 'Project Manager', department : 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'},
      { id: '52025', name: 'Asd', designation: 'support executive', department : 'Technical',exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026'}
    ]; 
  }
}
