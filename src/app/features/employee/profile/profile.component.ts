import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FolderDetail,
  DocumentDetail,
  DocumentHistoryItem,
  DocumentDetailById,
  SaveDocumentField
} from '../../../core/models/mydocument.model';
import { MyDocumentService } from '../../../core/services/mydocument.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  private readonly myDocumentService: MyDocumentService = inject(MyDocumentService);

  // ============ Existing profile data ============

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

  // ============ Documents tab state ============

  folders: FolderDetail[] = [];
  documents: DocumentDetail[] = [];
  selectedFolder: FolderDetail | null = null;

  loadingFolders = false;
  loadingDocuments = false;

  openMenuDocId: number | null = null;

  showHistoryPanel = false;
  historyDocName = '';
  historyItems: DocumentHistoryItem[] = [];
  loadingHistory = false;

  showEditPanel = false;
  editDoc: DocumentDetailById | null = null;
  editFieldValues: { [fieldId: number]: string } = {};
  loadingEditDoc = false;
  savingDocument = false;
  pendingUploadFileNames: string[] = []; // populated once upload endpoint is wired

  // ============ Tab switching (single definition) ============

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'Documents' && this.folders.length === 0) {
      this.loadFolders();
    }
  }

  // ============ Folder / Document loading ============

  loadFolders(): void {
    this.loadingFolders = true;
    this.myDocumentService.getAllFolderDetailsForEmployee().subscribe({
      next: (res) => {
        this.folders = res.data;
        this.loadingFolders = false;
        if (this.folders.length) {
          this.selectFolder(this.folders[0]);
        }
      },
      error: () => { this.loadingFolders = false; }
    });
  }

  selectFolder(folder: FolderDetail): void {
    this.selectedFolder = folder;
    this.openMenuDocId = null;
    this.loadDocuments(folder.folderId);
  }

  loadDocuments(folderId: number): void {
    this.loadingDocuments = true;
    this.myDocumentService.getAllDocumentDetailsForEmployee(folderId).subscribe({
      next: (res) => {
        this.documents = res.data;
        this.loadingDocuments = false;
      },
      error: () => { this.loadingDocuments = false; }
    });
  }

  toggleDocMenu(docId: number): void {
    this.openMenuDocId = this.openMenuDocId === docId ? null : docId;
  }

  statusLabel(status: number): string {
    return status === 1 ? 'Pending' : status === 2 ? 'Verified' : 'Rejected';
  }

  statusClass(status: number): string {
    return status === 1 ? 'status-pending' : status === 2 ? 'status-verified' : 'status-rejected';
  }

  // ============ History offcanvas ============

  openHistory(doc: DocumentDetail): void {
    this.openMenuDocId = null;
    this.showHistoryPanel = true;
    this.loadingHistory = true;
    this.myDocumentService.getDocumentHistoryDetails(doc.documentId).subscribe({
      next: (res) => {
        this.historyDocName = res.data.documentName;
        this.historyItems = res.data.history;
        this.loadingHistory = false;
      },
      error: () => { this.loadingHistory = false; }
    });
  }

  closeHistory(): void {
    this.showHistoryPanel = false;
  }

  // ============ Edit offcanvas (single definition) ============

  onEditDocument(doc: DocumentDetail): void {
    this.openMenuDocId = null;
    this.showEditPanel = true;
    this.loadingEditDoc = true;
    this.myDocumentService.getDocumentDetailsByIdForEmployee(doc.documentId).subscribe({
      next: (res) => {
        this.editDoc = res.data;
        this.editFieldValues = {};
        res.data.fields.forEach(f => {
          this.editFieldValues[f.fieldId] = f.fieldValue ?? '';
        });
        this.pendingUploadFileNames = res.data.files.map(f => f.relativePath);
        this.loadingEditDoc = false;
      },
      error: () => { this.loadingEditDoc = false; }
    });
  }

  closeEditPanel(): void {
    this.showEditPanel = false;
    this.editDoc = null;
  }

  onUpdateDocument(): void {
    if (!this.editDoc) return;

    const fields: SaveDocumentField[] = this.editDoc.fields.map(f => ({
      FieldId: f.fieldId,
      FieldValue: this.editFieldValues[f.fieldId] || '',
      IsRequired: f.isMandatory === 1
    }));

    this.savingDocument = true;
    this.myDocumentService.saveDocumentData({
      DocumentId: this.editDoc.documentId,
      EmployeeId: this.getEmployeeIdLocal(),
      Status: 1,
      Role: 2,
      MaxFileCount: this.editDoc.multipleFileCount || 1,
      Fields: fields,
      FileNames: this.pendingUploadFileNames
    }).subscribe({
      next: (res) => {
        this.savingDocument = false;
        if (res.success) {
          this.closeEditPanel();
          if (this.selectedFolder) {
            this.loadDocuments(this.selectedFolder.folderId);
          }
        }
      },
      error: () => { this.savingDocument = false; }
    });
  }

  onDownloadFiles(doc: DocumentDetail): void {
    this.openMenuDocId = null;
    // hook up file download using doc.documentId once download endpoint is confirmed
  }

  private getEmployeeIdLocal(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      return JSON.parse(userStr).Sf_code || '';
    } catch {
      return '';
    }
  }
}