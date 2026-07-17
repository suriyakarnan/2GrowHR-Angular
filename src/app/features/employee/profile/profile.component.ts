import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FolderDetail,
  DocumentDetail,
  DocumentHistoryItem,
  DocumentDetailById,
  DocumentFile,
  SaveDocumentField,
  ExistingFileRef, 
  UploadDocumentsResponse 
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
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly myDocumentService: MyDocumentService =
    inject(MyDocumentService);

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
    avatar: '',
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
        { label: 'Date of Birth', value: '...' },
      ],
      rightFields: [
        { label: 'Last Name', value: '...' },
        { label: 'Marital Status', value: 'Unmarried' },
        { label: 'Date of Joining', value: '05/02/2024' },
      ],
    },
    {
      title: 'Personal Info',
      colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
      leftFields: [
        { label: 'Blood Group', value: '...' },
        { label: 'Aadhaar No', value: '876456789878' },
        { label: 'PAN No', value: '...' },
      ],
      rightFields: [
        { label: 'Bank Name', value: '...' },
        { label: 'Bank Account No', value: '...' },
        { label: 'IFSC Code', value: 'UYFVYU567U4' },
      ],
    },
    {
      title: 'Address',
      colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
      leftFields: [
        { label: 'Current Address', value: 'No 47 Balaji Nagar Road.' },
        { label: '', value: 'TAMIL NADU' },
        { label: '', value: '600089' },
      ],
      rightFields: [
        { label: 'Permanent Address', value: 'Redhills Kathirvedu.' },
        { label: '', value: 'JHARKHAND' },
        { label: '', value: '600099' },
      ],
    },
  ];

  householdMembers = {
    title: 'Household Members',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    columns: [
      [
        { label: 'Relationship with employee', value: '...' },
        { label: 'Name', value: '...' },
        { label: 'Mobile', value: '...' },
      ],
      [
        { label: 'Relationship with employee', value: '...' },
        { label: 'Name', value: '...' },
        { label: 'Mobile', value: '...' },
      ],
    ],
  };

  educationalDetails = {
    title: 'Educational Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Qualification Name', 'Year'],
    rows: [{ qualification: '...', year: '...' }],
  };

  experienceDetails = {
    title: 'Experience Details',
    colSpan: 'col-12 col-md-6 col-lg-6 col-xl-4',
    headers: ['Company Name', 'Year'],
    rows: [{ company: '...', year: '...' }],
  };

  onResignationRequest(): void {
    // hook up API call here
  }

  onViewMoreDetails(section: string): void {
    // navigate or open modal based on section
  }

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
  selectedFiles: {
    name: string;
    uploaded: boolean;
    serverFileName?: string;
  }[] = [];

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
      error: () => {
        this.loadingFolders = false;
      },
    });
  }

  selectFolder(folder: FolderDetail): void {
    this.selectedFolder = folder;
    this.openMenuDocId = null;
    this.loadDocuments(folder.folderId);
  }

  loadDocuments(folderId: number): void {
  this.loadingDocuments = true;
  this.myDocumentService
    .getAllDocumentDetailsForEmployee(folderId)
    .subscribe({
      next: (res) => {
        this.documents = this.dedupeDocuments(res.data);
        this.loadingDocuments = false;
      },
      error: () => {
        this.loadingDocuments = false;
      },
    });
}

  toggleDocMenu(docId: number): void {
    if (this.openMenuDocId === docId) {
      this.openMenuDocId = null;
    } else {
      this.openMenuDocId = docId;
    }
  }

  statusLabel(status: number): string {
    return status === 1 ? 'Pending' : status === 2 ? 'Verified' : 'Rejected';
  }

  statusClass(status: number): string {
    return status === 1
      ? 'status-pending'
      : status === 2
        ? 'status-verified'
        : 'status-rejected';
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
      error: () => {
        this.loadingHistory = false;
      },
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
    this.myDocumentService
      .getDocumentDetailsByIdForEmployee(doc.documentId)
      .subscribe({
        next: (res) => {
          this.editDoc = res.data;
          this.editFieldValues = {};
          res.data.fields.forEach((f) => {
            this.editFieldValues[f.fieldId] = f.fieldValue ?? '';
          });
          this.pendingUploadFileNames = res.data.files.map(
            (f) => f.relativePath,
          );
          this.loadingEditDoc = false;
        },
        error: () => {
          this.loadingEditDoc = false;
        },
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
  const divId = this.getDivisionIdLocal();
  const editedDocId = this.editDoc.documentId;

  this.savingDocument = true;
  this.myDocumentService.saveDocumentData({
    OrganizationId: org ? Number(org) : 0,
    DivId: divId,
    DocumentId: editedDocId,
    EmployeeId: this.getEmployeeIdLocal(),
    Status: 1,
    Role: 2,
    MaxFileCount: this.editDoc.multipleFileCount || 1,
    DocumentDataId: this.editDoc.documentDataId
      ?? this.editDoc.fields.find(f => f.documentDataId)?.documentDataId
      ?? 0,
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
        // 👇 refresh expanded card if it was showing this same document
        if (this.expandedDocId === editedDocId) {
          this.expandedDocId = null;
          this.expandedDocFields = null;
          this.loadingExpandedDoc = true;
          this.myDocumentService.getDocumentDetailsByIdForEmployee(editedDocId).subscribe({
            next: (r) => {
              this.expandedDocId = editedDocId;
              this.expandedDocFields = r.data;
              this.loadingExpandedDoc = false;
            },
            error: () => { this.loadingExpandedDoc = false; }
          });
        }
      }
    },
    error: () => { this.savingDocument = false; }
  });
}

private getDivisionIdLocal(): number {
  const userStr = localStorage.getItem('user');
  if (!userStr) return 0;
  try {
    return Number(JSON.parse(userStr).Division_Code) || 0;
  } catch {
    return 0;
  }
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

    this.myDocumentService
      .getDocumentDetailsByIdForEmployee(doc.documentId)
      .subscribe({
        next: (res) => {
          this.expandedDocFields = res.data;
          this.loadingExpandedDoc = false;
        },
        error: () => {
          this.loadingExpandedDoc = false;
        },
      });
  }

  onViewFile(file: DocumentFile): void {
    this.myDocumentService.previewFile(file.fileId).subscribe({
      next: (blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      },
      error: (err) => console.error('File view failed:', err),
    });
  }

  onDownloadFiles(doc: DocumentDetail): void {
    this.openMenuDocId = null;
    this.myDocumentService
      .getDocumentDetailsByIdForEmployee(doc.documentId)
      .subscribe({
        next: (res) => {
          const files = res.data.files || [];
          files.forEach((file) => {
            if (file.allowToDownload) {
              this.triggerDownload(file.fileId, file.name);
            }
          });
        },
        error: () => {},
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
        link.download = fileName.endsWith('.pdf')
          ? fileName
          : `${fileName}.pdf`;
        // NOTE: no target="_blank" here — that's what pushes browsers toward "open" behavior
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => console.error('Download failed:', err),
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

  private dedupeDocuments(docs: DocumentDetail[]): DocumentDetail[] {
  const seen = new Set<string>();
  return docs.filter((d) => {
    const key = d.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

  const validFiles = Array.from(input.files).filter(f => this.isFileValid(f));
  if (validFiles.length) this.uploadFiles(validFiles);
  input.value = '';
}

  onFileDrop(event: DragEvent): void {
  event.preventDefault();
  if (!event.dataTransfer?.files) return;

  const validFiles = Array.from(event.dataTransfer.files).filter(f => this.isFileValid(f));
  if (validFiles.length) this.uploadFiles(validFiles);
}

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // required to allow drop
  }

  private uploadFiles(files: File[]): void {
  if (!this.editDoc) return;

  const entries = files.map(f => ({ name: f.name, uploaded: false }));
  this.selectedFiles.push(...entries);
  this.uploadingFile = true;

  const existingFiles = this.editDoc.files.map(f => ({
    FileId: f.fileId,
    RelativePath: f.relativePath
  }));

  this.myDocumentService.uploadDocuments(
    files,
    this.editDoc.multipleFileCount || 1,
    existingFiles
  ).subscribe({
    next: (res) => {
      if (res.success) {
        entries.forEach(e => e.uploaded = true);
        this.pendingUploadFileNames = res.data; // canonical merged list from backend
      }
      this.uploadingFile = false;
    },
    error: (err) => {
      console.error('Upload failed:', err);
      this.selectedFiles = this.selectedFiles.filter(e => !entries.includes(e));
      this.uploadingFile = false;
    }
  });
}

private isFileValid(file: File): boolean {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeBytes = 3 * 1024 * 1024; // 3MB

  if (!allowedTypes.includes(file.type)) {
    console.error(`${file.name}: unsupported file type`);
    return false;
  }
  if (file.size > maxSizeBytes) {
    console.error(`${file.name}: exceeds 3MB limit`);
    return false;
  }
  return true;
}

  removeSelectedFile(entry: { name: string; uploaded: boolean }): void {
  this.selectedFiles = this.selectedFiles.filter(f => f !== entry);
}

// Merges duplicate field submissions into one row per field name,
// comma-joining their values — e.g. "Ajin123,Ajin123,Ajin,Ajin"
get expandedFieldsMerged(): { fieldName: string; fieldValue: string }[] {
  if (!this.expandedDocFields) return [];
  const order: string[] = [];
  const map = new Map<string, string[]>();

  this.expandedDocFields.fields.forEach((f) => {
    const key = f.fieldName;
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(f.fieldValue ?? '');
  });

  return order.map((fieldName) => ({
    fieldName,
    fieldValue: map.get(fieldName)!.join(','),
  }));
}
  

  
}
