// src/app/core/models/mydocument.model.ts

export interface FolderDetail {
  folderId: number;
  name: string;
  isPendingExists: boolean;
  isVerified: boolean;
  isRejectedExists: boolean;
  documentsCount: number;
}

export interface FolderDetailsResponse {
  success: boolean;
  data: FolderDetail[];
  message: string;
}

export interface DocumentDetail {
  documentId: number;
  name: string;
  isDataExists: boolean;
  allowToDownload: boolean;
  filesCount: number;
  isVerificationRequired: boolean;
  allowToViewByManagerHierarchy: boolean;
  status: number;          // 1 = pending, 2 = verified, 3 = rejected
  isMandatory: boolean;
  rejectedReason: string;
}

export interface DocumentDetailsResponse {
  success: boolean;
  data: DocumentDetail[];
  message: string;
}

export interface DocumentHistoryItem {
  date: string;
  status: number;
  remarks: string;
  role: number;            // 1 = admin, 2 = employee
  approvedBy: string;
}

export interface DocumentHistoryData {
  documentName: string;
  isVerificationRequired: boolean;
  history: DocumentHistoryItem[];
}

export interface DocumentHistoryResponse {
  success: boolean;
  data: DocumentHistoryData;
  message: string;
}

export interface DocumentField {
  fieldId: number;
  documentId: number;
  folderId: number;
  fieldName: string;
  fieldType: number;       // 3 = single select (more values TBD)
  isMandatory: number;
  createdDate: string;
  options: string[];
  fieldValue: string | null;
  documentDataId: number;
}

export interface DocumentFile {
  fileId: number;
  url: string;
  name: string;
  size: number;
  allowToDownload: boolean;
  relativePath: string;
  employeeId: string | null;
  divId: number;
}

export interface DocumentDetailById {
  organizationId: number;
  employeeName: string;
  documentId: number;
  folderId: number;
  name: string;
  description: string | null;
  allowMultipleFiles: number;      // 0 = single file, 1 = multi-file
  multipleFileCount: number;       // max upload slots when multi-file
  onboarding: number;
  hrms: number;
  isMandatory: number;
  isVerificationRequired: number;
  askEmployeeForExpiryDate: number;
  allowEmployeeMarkNotApplicable: number;
  allowToDownload: number;         // 1 = show download btn, 0 = hide
  allowToViewByManagerHierarchy: number;
  isActive: boolean;
  createdDate: string;
  accessList: any;
  fields: DocumentField[];
  files: DocumentFile[];
  folderActive: boolean;
}

export interface DocumentDetailByIdResponse {
  success: boolean;
  data: DocumentDetailById;
  message: string;
}

export interface SaveDocumentField {
  FieldId: number;
  FieldValue: string;
  IsRequired: boolean;
}

export interface SaveDocumentPayload {
  DocumentId: number;
  EmployeeId: string;
  Status: number;
  Role: number;
  MaxFileCount: number;
  Fields: SaveDocumentField[];
  FileNames: string[];
}

export interface SaveDocumentResponse {
  success: boolean;
  message: string;
}