import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { TableDatatableDirective } from '../../../../shared/components/data-table/table-datatable.directive';
import { SelectpickerDirective } from '../../../../shared/components/selectpicker/selectpicker.directive';

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
  selector: 'app-full-final-settlement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,           // ✅ routerLink="..."
    RouterLinkActive,     // ✅ routerLinkActive="active"
    RouterOutlet,         // ✅ <router-outlet>
    TableDatatableDirective,
    SelectpickerDirective,
  ],
  templateUrl: './full-final-settlement.component.html',
  styleUrl: './full-final-settlement.component.css'
})
export class FullFinalSettlementComponent implements OnInit {

  historyComponent = false;
  employees: Employee[] = [];
  selectedDivision: string[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.historyComponent = this.router.url.includes('history');
    });
  }

  ngOnInit(): void {
    this.historyComponent = this.router.url.includes('history');
    this.employees = [
      { id: 'SA/PMR/Tech/xx016', name: 'Akil', designation: 'Project Manager', department: 'Technical', exittype: 'Resigned', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: 'SEF0082', name: 'Selvakumar K', designation: 'Testing Engineer', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: 'SITCO001', name: 'Selvakumar K', designation: 'Managing Director', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: '2406', name: 'Anbarasan', designation: 'Project Manager', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: 'EMP007', name: 'Amit', designation: 'Software Developer', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: 'SA/SE/Finance/xx011', name: 'Vijay K', designation: 'Project Manager', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' },
      { id: '52025', name: 'Asd', designation: 'Support Executive', department: 'Technical', exittype: 'Regular', initiateDate: '04/02/2026', lastWorkingDate: '05/02/2026' }
    ];
  }
}