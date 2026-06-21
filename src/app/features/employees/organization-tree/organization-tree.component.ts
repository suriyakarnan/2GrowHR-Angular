import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrgMember {
  id: string;
  name: string;
  code: string;        // e.g. "SA/SE/Finance/xx011"
  role: string;         // e.g. "Project Manager"
  reportsTo: string;    // e.g. "N/A"
  department: string;   // e.g. "Technical"
}

@Component({
  selector: 'app-organization-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-tree.component.html',
  styleUrl: './organization-tree.component.css'
})
export class OrganizationTreeComponent implements OnInit {
  rootMember: OrgMember | null = null;
  directReports: OrgMember[] = [];

  ngOnInit(): void {
    this.loadOrgChart();
  }

  private loadOrgChart(): void {
    // Replace this with a real call, e.g.:
    // this.orgService.getOrgChart(rootId).subscribe(data => { ... });
    // When that happens: implement OnDestroy, store the Subscription,
    // and unsubscribe in ngOnDestroy() to avoid memory leaks.
    this.rootMember = { id: 'root', name: 'ADMIN', code: '', role: '', reportsTo: '', department: '' };
    this.directReports = this.generateMockReports(64);
  }

  // Purely for local preview — delete once the API is wired up.
  // The "64" here is just the mock seed count; everything downstream
  // (badge, card count, layout) reacts to directReports.length, not this number.
  private generateMockReports(count: number): OrgMember[] {
    const names       = ['SARISHMA', 'VIKNESH H H', 'RAM KUMAR', 'YNYJUM UYMU', 'POOVAZHAGI', 'SIN'];
    const roles        = ['Project Manager', 'SOFTWARE DEVELO.'];
    const departments  = ['Technical', 'Support'];

    return Array.from({ length: count }, (_, i) => ({
      id: `emp-${i + 1}`,
      name: names[i % names.length],
      code: `SA/SE/Finance/xx${String(i + 1).padStart(3, '0')}`,
      role: roles[i % roles.length],
      reportsTo: 'N/A',
      department: departments[i % departments.length]
    }));
  }

  get totalCount(): number {
    return this.directReports.length;
  }

  trackByMemberId(index: number, member: OrgMember): string {
    return member.id;
  }

  onTopOfOrg(): void {
    // Navigate back to the root of the organization tree
  }

  onMoreOptions(): void {
    // Open the "..." action menu
  }
}