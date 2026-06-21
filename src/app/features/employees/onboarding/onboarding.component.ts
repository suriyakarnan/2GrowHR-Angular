import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TableDatatableDirective } from '../../../shared/components/data-table/table-datatable.directive';

interface Employee {
  id: string;
  name: string;
  
}

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule,  FormsModule, TableDatatableDirective],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent {

  employees: Employee[] = [];

  ngOnInit(): void {
    this.employees = [
      { id: '76', name: 'Vsrvr', },
      
    ];
  }

}
