import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// employee-header.component.ts
@Component({
  selector: 'app-employee-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-header.component.html',
  styleUrls: ['./employee-header.component.css']
})
export class EmployeeHeaderComponent {
  

  @Input() title: string = '';

  isActionsOpen = false;

  toggleActions(): void {
    this.isActionsOpen = !this.isActionsOpen;
  }

  constructor(private router: Router) {}

  // Edit Button Click → Wall Activity Page
// ...same logic as AdminHeaderComponent, but:
  goToWallActivity() {
    this.router.navigate(['/employee/dashboard/wall-activity']); // if employee has this feature
  }

}

