import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { TableDatatableDirective } from '../../../../shared/components/data-table/table-datatable.directive';
import { filter } from 'rxjs/operators';
import { SelectpickerDirective } from '../../../../shared/components/selectpicker/selectpicker.directive';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: string;
  name: string;
  deactivated: boolean;
  status: 'Deactivate' | 'By Disability' | 'Regular' | 'Abscond' | 'Duplicate User';
}

@Component({
  selector: 'app-resigned-deactivated-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TableDatatableDirective, SelectpickerDirective, FormsModule],
  templateUrl: './resigned-deactivated-list.component.html',
  styleUrl: './resigned-deactivated-list.component.css'
})
export class ResignedDeactivatedListComponent implements OnInit {
  isDetailedView = false;
  employees: Employee[] = [];
  selectedDivision: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isDetailedView = this.router.url.includes('detailed-view');
    });
  }

  ngOnInit(): void {
    this.isDetailedView = this.router.url.includes('detailed-view');
    this.employees = [
      { id: '101', name: 'Kk F', deactivated: true, status: 'Deactivate' },
      { id: '111', name: 'Anis K', deactivated: true, status: 'Deactivate' },
      { id: '1111', name: 'Naa', deactivated: false, status: 'By Disability' },
      { id: '1112', name: 'Maa', deactivated: false, status: 'Regular' },
      { id: '112', name: 'Nisha', deactivated: false, status: 'Regular' }
    ];
  }
}