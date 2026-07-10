import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InfoField {
  label: string;
  value: string;
}

interface InfoPanel {
  title: string;
  colSpan: string;
  leftFields: InfoField[];
  rightFields: InfoField[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  employee = {
    firstName: 'Mr. Beast',
    lastName: '...',
    email: 'beast@gmail.com',
    mobile: '9876543211',
    employeeId: 'AT/QA/AUT/xx013',
    division: 'Automate',
    department: 'Autoamtion',
    designation: 'Quality Assur',
    city: 'CHENNAI',
    reportingTo: 'Kamal - AT/QA/AUT/xx016',
    avatar: ''
  };

  tabs = ['Basic Info', 'Work Info', 'Documents', 'Team'];
  activeTab = 'Basic Info';

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

    basicInfoPanels: InfoPanel[] = [
    {
      title: 'Basic Info',
      colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
      leftFields: [
        { label: 'First Name', value: 'Mr. Beast' },
        { label: 'Gender', value: 'Male' },
        { label: 'Date of Birth', value: '...' }
      ],
      rightFields: [
        { label: 'Last Name', value: '...' },
        { label: 'Marital Status', value: 'Unmarried' },
        { label: 'Date of Joining', value: '05/02/2024' }
      ]
    },
    {
      title: 'Personal Info',
      colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
      leftFields: [
        { label: 'Blood Group', value: '...' },
        { label: 'Aadhaar No', value: '876456789878' },
        { label: 'PAN No', value: '...' }
      ],
      rightFields: [
        { label: 'Bank Name', value: '...' },
        { label: 'Bank Account No', value: '...' },
        { label: 'IFSC Code', value: 'UYFVYU567U4' }
      ]
    },
    {
      title: 'Address',
      colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
      leftFields: [
        { label: 'Current Address', value: 'No 47 Balaji Nagar Road.' },
        { label: '', value: 'TAMIL NADU' },
        { label: '', value: '600089' }
      ],
      rightFields: [
        { label: 'Permanent Address', value: 'Redhills Kathirvedu.' },
        { label: '', value: 'JHARKHAND' },
        { label: '', value: '600099' }
      ]
    }
  ];

  householdMembers = {
    title: 'Household Members',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    columns: [
      [
        { label: 'Relationship with employee', value: '...' },
        { label: 'Name', value: '...' },
        { label: 'Mobile', value: '...' }
      ],
      [
        { label: 'Relationship with employee', value: '...' },
        { label: 'Name', value: '...' },
        { label: 'Mobile', value: '...' }
      ]
    ]
  };

  educationalDetails = {
    title: 'Educational Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Qualification Name', 'Year'],
    rows: [
      { qualification: '...', year: '...' }
    ]
  };

  experienceDetails = {
    title: 'Experience Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Company Name', 'Year'],
    rows: [
      { company: '...', year: '...' }
    ]
  };

  onResignationRequest(): void {
    // hook up API call here
  }

  onViewMoreDetails(section: string): void {
    // navigate or open modal based on section
  }
}