import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  FolderDetailsResponse,
  DocumentDetailsResponse,
  DocumentHistoryResponse,
  DocumentDetailByIdResponse,
  SaveDocumentPayload,
  SaveDocumentResponse,
  UploadFileResponse,
  ExistingFileRef,
  UploadDocumentsResponse,
} from '../models/mydocument.model';

const URL = 'api/';

@Injectable({ providedIn: 'root' })
export class MyDocumentService {
  private readonly apiService: ApiService = inject(ApiService);

  private getOrganizationId(): number {
    const org = localStorage.getItem('org');
    return org ? Number(org) : 0;
  }

  private getEmployeeId(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      return JSON.parse(userStr).Sf_code || '';
    } catch {
      return '';
    }
  }

  private getDivisionId(): number {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 0;
    try {
      return Number(JSON.parse(userStr).Division_Code) || 0;
    } catch {
      return 0;
    }
  }

  getAllFolderDetailsForEmployee(
    employeeId?: string,
  ): Observable<FolderDetailsResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      EmployeeId: employeeId ?? this.getEmployeeId(),
    };
    return this.apiService.post<FolderDetailsResponse>(
      `${URL}GetAllFolderDetailsForEmployee`,
      body,
    );
  }

  getAllDocumentDetailsForEmployee(
    folderId: number,
    employeeId?: string,
  ): Observable<DocumentDetailsResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      FolderId: folderId,
      EmployeeId: employeeId ?? this.getEmployeeId(),
      DivId: this.getDivisionId(),
    };
    return this.apiService.post<DocumentDetailsResponse>(
      `${URL}GetAllDocumentDetailsForEmployee`,
      body,
    );
  }

  getDocumentHistoryDetails(
    documentId: number,
    employeeId?: string,
  ): Observable<DocumentHistoryResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      EmployeeId: employeeId ?? this.getEmployeeId(),
      DocumentId: documentId,
    };
    return this.apiService.post<DocumentHistoryResponse>(
      `${URL}GetDocumentHistoryDetails`,
      body,
    );
  }

  getDocumentDetailsByIdForEmployee(
    documentId: number,
    employeeId?: string,
  ): Observable<DocumentDetailByIdResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      DocumentId: documentId,
      EmployeeId: employeeId ?? this.getEmployeeId(),
      DivId: this.getDivisionId(),
    };
    return this.apiService.post<DocumentDetailByIdResponse>(
      `${URL}GetDocumentDetailsByIdForEmployee`,
      body,
    );
  }

  saveDocumentData(
    payload: SaveDocumentPayload,
  ): Observable<SaveDocumentResponse> {
    return this.apiService.post<SaveDocumentResponse>(
      `${URL}SaveDocumentData`,
      payload,
    );
  }

  downloadFileBlob(fileUrl: string): Observable<Blob> {
    return this.apiService.getBlob(fileUrl);
  }

  previewFile(fileId: number): Observable<Blob> {
    return this.apiService.postFile(`${URL}PreviewFile`, { FileId: fileId });
  }

  uploadDocumentFile(file: File): Observable<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.apiService.postForm<UploadFileResponse>(
      `${URL}UploadDocumentFile`,
      formData,
    );
  }

  uploadDocuments(files: File[],maxFileCount: number,existingFiles: ExistingFileRef[],employeeId?: string,): Observable<UploadDocumentsResponse> {
    const formData = new FormData();
    formData.append('OrganizationId', String(this.getOrganizationId()));
    formData.append('DivId', String(this.getDivisionId()));
    formData.append('EmployeeId', employeeId ?? this.getEmployeeId());
    formData.append('MaxFileCount', String(maxFileCount));
    formData.append('ExistingFiles', JSON.stringify(existingFiles));
    files.forEach((f) => formData.append('Files', f, f.name));

    return this.apiService.postForm<UploadDocumentsResponse>(
      `${URL}UploadDocuments`,
      formData,
    );
  }
}
