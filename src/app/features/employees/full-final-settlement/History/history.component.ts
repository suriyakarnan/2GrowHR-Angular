import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { SelectpickerDirective } from '../../../../shared/components/selectpicker/selectpicker.directive';
import { DateRangePickerDirective } from '../../../../shared/components/datepicker/date-range-picker.directive';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule, DateRangePickerDirective, SelectpickerDirective ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  selectedDivision: string = '';
  selectedDateRange: string = ''; 



}
