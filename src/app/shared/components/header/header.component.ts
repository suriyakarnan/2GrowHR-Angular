import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() title: string = '';

  isActionsOpen = false;

  toggleActions(): void {
    this.isActionsOpen = !this.isActionsOpen;
  }

  constructor(private router: Router) {}

  // Edit Button Click → Wall Activity Page
  goToWallActivity() {
  this.router.navigate(['/dashboard/wall-activity']);
}

}