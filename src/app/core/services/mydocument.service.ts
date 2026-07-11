// src/app/core/services/mydocument.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  FolderDetailsResponse,
  DocumentDetailsResponse,
  DocumentHistoryResponse,
  DocumentDetailByIdResponse,
  SaveDocumentPayload,
  SaveDocumentResponse
} from '../models/mydocument.model';

// Note: JSON endpoints — no trailing 'wallposts/'-style sub-path,
// each call hits /api/<EndpointName> directly (matches your Postman URLs).
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

  /** POST GetAllFolderDetailsForEmployee — { OrganizationId, EmployeeId } */
  getAllFolderDetailsForEmployee(employeeId?: string): Observable<FolderDetailsResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      EmployeeId: employeeId ?? this.getEmployeeId()
    };
    return this.apiService.post<FolderDetailsResponse>(`${URL}GetAllFolderDetailsForEmployee`, body);
  }

  /** POST GetAllDocumentDetailsForEmployee — { OrganizationId, FolderId, EmployeeId } */
  getAllDocumentDetailsForEmployee(folderId: number, employeeId?: string): Observable<DocumentDetailsResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      FolderId: folderId,
      EmployeeId: employeeId ?? this.getEmployeeId()
    };
    return this.apiService.post<DocumentDetailsResponse>(`${URL}GetAllDocumentDetailsForEmployee`, body);
  }

  /** POST GetDocumentHistoryDetails — { OrganizationId, EmployeeId, DocumentId } */
  getDocumentHistoryDetails(documentId: number, employeeId?: string): Observable<DocumentHistoryResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      EmployeeId: employeeId ?? this.getEmployeeId(),
      DocumentId: documentId
    };
    return this.apiService.post<DocumentHistoryResponse>(`${URL}GetDocumentHistoryDetails`, body);
  }

  /**
   * POST GetDocumentDetailsByIdForEmployee — body not shown in your screenshot
   * (only headers were captured), so this mirrors the same key pattern as the
   * other three calls. Confirm against Postman's Body tab if this 400s.
   */
  getDocumentDetailsByIdForEmployee(documentId: number, employeeId?: string): Observable<DocumentDetailByIdResponse> {
    const body = {
      OrganizationId: this.getOrganizationId(),
      DocumentId: documentId,
      EmployeeId: employeeId ?? this.getEmployeeId()
    };
    return this.apiService.post<DocumentDetailByIdResponse>(`${URL}GetDocumentDetailsByIdForEmployee`, body);
  }

  saveDocumentData(payload: SaveDocumentPayload): Observable<SaveDocumentResponse> {
  return this.apiService.post<SaveDocumentResponse>(`${URL}SaveDocumentData`, payload);
}
}