import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InfoPanel } from '../../../../../core/models/profile.model';
import { EmployeeInfo } from '../../../../../core/models/employeeinfo.model';
import { ProfileDetailPanelComponent } from '../../../../../shared/components/profile-detail-panel/profile-detail-panel.component';
import { EmployeeInfoService } from '../../../../../core/services/employeeinfo.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileDetailPanelComponent],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css',
})
export class EmployeeProfileComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly employeeInfoService: EmployeeInfoService = inject(EmployeeInfoService);

  employeeId: string = '';
  isLoading = false;
  errorMsg = '';

  employee: EmployeeInfo = {
    id: '',
    empCode: '',
    salutation: '',
    firstName: '',
    lastName: '',
    fullName: '',
    gender: '',
    dob: '',
    doj: '',
    marital: 0,
    mobile: '',
    mobile2: '',
    email: '',
    divisionName: '',
    departmentName: '',
    designationName: '',
    cityId: 0,
    bloodGroup: '',
    aadhaar: '',
    bank: '',
    bankAc: '',
    branchName: '',
    pan: '',
    ifsc: '',
    addr1: '',
    addr2: '',
    pincode: '',
    permAddr1: '',
    permAddr2: '',
    permPincode: '',
  };

  // Admin view has one extra tab vs employee self-view
  tabs = ['Basic Info', 'Work Info', 'Documents', 'Team', 'Access Control'];
  activeTab = 'Basic Info';

  basicInfoPanels: InfoPanel[] = [];

  // API doesn't return these yet (family_details/education_details/working_details
  // are just flags in Get_Employee_Info, not actual rows) — keep as placeholders
  // until a dedicated endpoint (e.g. getWorkInfoDetail) is wired in.
  householdMembers = {
    title: 'Household Members',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    columns: [] as { label: string; value: string }[][],
  };

  educationalDetails = {
    title: 'Educational Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Qualification Name', 'Year'],
    rows: [] as { qualification: string; year: string }[],
  };

  experienceDetails = {
    title: 'Experience Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Company Name', 'Year'],
    rows: [] as { company: string; year: string }[],
  };

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId') || '';
    this.loadEmployeeProfile();
  }

  loadEmployeeProfile(): void {
    const orgId = Number(localStorage.getItem('org')) || 0;

    this.isLoading = true;
    this.errorMsg = '';

    this.employeeInfoService.getEmployeeInfo(orgId, this.employeeId).subscribe({
      next: (data: EmployeeInfo) => {
        this.isLoading = false;
        if (!data || !data.id) {
          this.errorMsg = 'Employee not found';
          return;
        }
        this.employee = data;
        this.buildBasicInfoPanels(data);
      },
      error: (err: unknown) => {
        this.isLoading = false;
        this.errorMsg = 'Failed to load employee profile';
        console.error('Failed to load employee profile:', err);
      },
    });
  }

  private buildBasicInfoPanels(data: EmployeeInfo): void {
    this.basicInfoPanels = [
      {
        title: 'Basic Info',
        colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
        leftFields: [
          { label: 'First Name', value: data.firstName || '-' },
          { label: 'Gender', value: data.gender || '-' },
          { label: 'Date of Birth', value: this.formatDate(data.dob) },
        ],
        rightFields: [
          { label: 'Last Name', value: data.lastName || '-' },
          { label: 'Marital Status', value: data.marital === 1 ? 'Married' : 'Unmarried' },
          { label: 'Date of Joining', value: this.formatDate(data.doj) },
        ],
      },
      {
        title: 'Personal Info',
        colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
        leftFields: [
          { label: 'Blood Group', value: data.bloodGroup || '-' },
          { label: 'Aadhaar No', value: data.aadhaar || '-' },
          { label: 'PAN No', value: data.pan || '-' },
        ],
        rightFields: [
          { label: 'Bank Name', value: data.bank || '-' },
          { label: 'Bank Account No', value: data.bankAc || '-' },
          { label: 'IFSC Code', value: data.ifsc || '-' },
        ],
      },
      {
        title: 'Address',
        colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
        leftFields: [
          { label: 'Current Address', value: `${data.addr1 || ''} ${data.addr2 || ''}`.trim() || '-' },
          { label: '', value: '' },
          { label: '', value: data.pincode || '' },
        ],
        rightFields: [
          { label: 'Permanent Address', value: `${data.permAddr1 || ''} ${data.permAddr2 || ''}`.trim() || '-' },
          { label: '', value: '' },
          { label: '', value: data.permPincode || '' },
        ],
      },
    ];
  }

  private formatDate(value: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    if (d.getFullYear() <= 1900) return '-'; // default/blank dates from SQL (e.g. DOW)
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  onViewMoreDetails(section: string): void {
    // navigate or open modal based on section
  }

  onEditPanel(panelTitle: string): void {
    // TODO: open edit offcanvas/modal for this panel, scoped to this.employeeId
    console.log('Edit requested for panel:', panelTitle, 'employeeId:', this.employeeId);
  }
}