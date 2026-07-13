import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FolderDetail,
  DocumentDetail,
  DocumentHistoryItem,
  DocumentDetailById,
  DocumentFile, 
  SaveDocumentField
} from '../../../core/models/mydocument.model';
import { MyDocumentService } from '../../../core/services/mydocument.service';
import { environment } from '../../../../environments/environment';

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

  expandedDocId: number | null = null;
  expandedDocFields: DocumentDetailById | null = null;
  loadingExpandedDoc = false;

  uploadingFile = false;
  selectedFiles: { name: string; uploaded: boolean; serverFileName?: string }[] = [];

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
    this.selectedFiles = [];
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

  const org = localStorage.getItem('org');
  const userStr = localStorage.getItem('user');
  const divId = userStr ? Number(JSON.parse(userStr).Division_Code) || 0 : 0;

  this.savingDocument = true;
  this.myDocumentService.saveDocumentData({
    OrganizationId: org ? Number(org) : 0,
    DivId: divId,
    DocumentId: this.editDoc.documentId,
    EmployeeId: this.getEmployeeIdLocal(),
    Status: 1,
    Role: 2,
    MaxFileCount: this.editDoc.multipleFileCount || 1,
    DocumentDataId: this.editDoc.fields[0]?.documentDataId ?? 0,
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

 

   toggleDocExpand(doc: DocumentDetail): void {
    // Collapse if same card clicked again
    if (this.expandedDocId === doc.documentId) {
      this.expandedDocId = null;
      this.expandedDocFields = null;
      return;
    }

    this.expandedDocId = doc.documentId;
    this.expandedDocFields = null;
    this.loadingExpandedDoc = true;

    this.myDocumentService.getDocumentDetailsByIdForEmployee(doc.documentId).subscribe({
      next: (res) => {
        this.expandedDocFields = res.data;
        this.loadingExpandedDoc = false;
      },
      error: () => { this.loadingExpandedDoc = false; }
    });
  }

  onViewFile(file: DocumentFile): void {
  this.myDocumentService.previewFile(file.fileId).subscribe({
    next: (blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    },
    error: (err) => console.error('File view failed:', err)
  });
}

 onDownloadFiles(doc: DocumentDetail): void {
  this.openMenuDocId = null;
  this.myDocumentService.getDocumentDetailsByIdForEmployee(doc.documentId).subscribe({
    next: (res) => {
      const files = res.data.files || [];
      files.forEach(file => {
        if (file.allowToDownload) {
          this.triggerDownload(file.fileId, file.name);
        }
      });
    },
    error: () => {}
  });
}

  private triggerDownload(fileId: number, fileName: string): void {
  this.myDocumentService.previewFile(fileId).subscribe({
    next: (blob) => {
      // Force the correct MIME type regardless of what the server sent —
      // this is what stops the browser from routing it to an inline viewer.
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      // NOTE: no target="_blank" here — that's what pushes browsers toward "open" behavior
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    },
    error: (err) => console.error('Download failed:', err)
  });
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

  private buildFileUrl(file: DocumentFile): string {
    let path: string;
    try {
      const parsed = new URL(file.url);
      path = parsed.pathname.replace(/^\/+/, '/') + parsed.search; // collapse //
    } catch {
      path = '/' + file.relativePath;
    }

    const origin = environment.fileServerUrl.replace(/\/+$/, '');
    return `${origin}${path}`;
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  Array.from(input.files).forEach(file => this.uploadFile(file));
  input.value = ''; // allow re-selecting the same file name later
}

onFileDrop(event: DragEvent): void {
  event.preventDefault();
  if (!event.dataTransfer?.files) return;
  Array.from(event.dataTransfer.files).forEach(file => this.uploadFile(file));
}

onDragOver(event: DragEvent): void {
  event.preventDefault(); // required to allow drop
}

private uploadFile(file: File): void {
  // Basic client-side validation matching your existing hint text
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeBytes = 3 * 1024 * 1024; // 3MB

  if (!allowedTypes.includes(file.type)) {
    console.error(`${file.name}: unsupported file type`);
    return;
  }
  if (file.size > maxSizeBytes) {
    console.error(`${file.name}: exceeds 3MB limit`);
    return;
  }

  const entry: { name: string; uploaded: boolean; serverFileName?: string } = { name: file.name, uploaded: false };
  this.selectedFiles.push(entry);
  this.uploadingFile = true;

  this.myDocumentService.uploadDocumentFile(file).subscribe({
    next: (res) => {
      if (res.success) {
        entry.uploaded = true;
        entry.serverFileName = res.data.fileName;
        this.pendingUploadFileNames.push(res.data.fileName);
      }
      this.uploadingFile = false;
    },
    error: (err) => {
    if (err.status === 401 || err.status === 0 || err.status === 500) {
      // Session likely expired server-side — force re-login
      console.error('Upload failed, possibly due to expired session:', err);
      // e.g. redirect to login, or show "please log in again"
    }
    this.selectedFiles = this.selectedFiles.filter(f => f !== entry);
    this.uploadingFile = false;
  }
  });
}

removeSelectedFile(entry: { name: string; uploaded: boolean; serverFileName?: string }): void {
  this.selectedFiles = this.selectedFiles.filter(f => f !== entry);
  if (entry.serverFileName) {
    this.pendingUploadFileNames = this.pendingUploadFileNames.filter(n => n !== entry.serverFileName);
  }
}
}