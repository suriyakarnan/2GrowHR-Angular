import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPanel } from '../../../core/models/profile.model'; 

@Component({
  selector: 'app-profile-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-detail-panel.component.html',
  styleUrl: './profile-detail-panel.component.css',
})
export class ProfileDetailPanelComponent {
  @Input() panel!: InfoPanel;
  @Input() showEdit: boolean = false;  

  @Output() viewMore = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  onViewMore(): void {
    this.viewMore.emit(this.panel.title);
  }

  onEdit(): void {
    this.edit.emit(this.panel.title);
  }
}