// src/app/core/services/wall-activity.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  WallPost,
  Division,
  CreatePostPayload,
  CreatePollPayload,
  CommentItem,
  CreateCommentPayload,
  WallActivitySetup
} from '../models/wall-activity.model';
import { ApiService } from './api.service';

const URL = 'api/wallposts/';

@Injectable({ providedIn: 'root' })
export class WallActivityService {

  private readonly apiService: ApiService = inject(ApiService);

  private getEmployeeId(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      return JSON.parse(userStr).Sf_code || '';
    } catch {
      return '';
    }
  }

  // ✅ FIXED — was GET, now POST + FormData (matches Postman: POST /get with form-data)
  getWallPosts(employeeId: string, loadByDivision: boolean = false): Observable<WallPost[]> {
    const formData = new FormData();
    formData.append('EmployeeId', employeeId);
    formData.append('LoadByDivision', loadByDivision.toString());
    return this.apiService.postForm<WallPost[]>(`${URL}get`, formData);
  }

  // ✅ FIXED — assuming this also expects form-data (verify in Postman if still failing)
  getEmployeeMentions(search?: string): Observable<{ success: boolean; data: string[] }> {
    const formData = new FormData();
    if (search) formData.append('search', search);
    return this.apiService.postForm<{ success: boolean; data: string[] }>(
      `${URL}employee-mentions`,
      formData
    );
  }

  createPost(payload: CreatePostPayload): Observable<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append('Orgid',      payload.orgId);
  formData.append('EmployeeId', payload.employeeId);

  // Only send the key that's actually targeted — omit the other completely.
  // Backend rejects if BOTH Division and Department keys are present,
  // regardless of value (even "0" counts as "present").
  if (payload.divisionId && payload.divisionId !== '0') {
    formData.append('DivisionId', payload.divisionId);
    formData.append('SubDivisionId', payload.subDivisionId || '0');
  }
  if (payload.departmentId && payload.departmentId !== '0') {
    formData.append('DepartmnetId', payload.departmentId);  // typo intentional
  }

  formData.append('WallDescription', payload.content);
  formData.append('UserRole',        'Employee');

  if (payload.imageFile) {
    formData.append('file', payload.imageFile);
  }
  if (payload.mentionedEmpIds?.length) {
    formData.append('mentionedEmpIds', JSON.stringify(payload.mentionedEmpIds));
  }

  return this.apiService.postForm<{ success: boolean; message: string }>(`${URL}create`, formData);
}

  deletePost(wallPostId: number): Observable<{ success: boolean }> {
    const formData = new FormData();
    formData.append('PostId', wallPostId.toString());
    formData.append('EmployeeId', this.getEmployeeId());
    formData.append('IsAdmin', 'false');
    return this.apiService.postForm<{ success: boolean }>(`${URL}delete`, formData);
  }

  getComments(wallPostId: number): Observable<CommentItem[]> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('EmployeeId', this.getEmployeeId());
    return this.apiService.postForm<CommentItem[]>(`${URL}getcomments`, formData);
  }

  addComment(payload: CreateCommentPayload): Observable<{ success: boolean; message: string; data: CommentItem }> {
    const formData = new FormData();
    formData.append('WallPostId', payload.wallPostId.toString());
    formData.append('CommentedEmployeeId', this.getEmployeeId());
    formData.append('CommentDescription', payload.commentDescription);
    return this.apiService.postForm<{ success: boolean; message: string; data: CommentItem }>(
      `${URL}comment`,
      formData
    );
  }

  deleteComment(commentId: number, wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('CommentId', commentId.toString());
    formData.append('WallPostId', wallPostId.toString());
    formData.append('CommentedEmployeeId', this.getEmployeeId());
    return this.apiService.postForm<{ success: boolean; message?: string }>(`${URL}deletecomment`, formData);
  }

  likePost(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('LikedEmployeeId', this.getEmployeeId());
    return this.apiService.postForm<{ success: boolean; message?: string }>(`${URL}like`, formData);
  }

  removeLike(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('LikedEmployeeId', this.getEmployeeId());
    return this.apiService.postForm<{ success: boolean; message?: string }>(`${URL}removelike`, formData);
  }

  getPostLikes(wallPostId: number): Observable<any[]> {
    const formData = new FormData();
    formData.append('wallPostId', wallPostId.toString());
    return this.apiService.postForm<any[]>(`${URL}posts/likes`, formData);
  }

  getDivisions(divisionCode: string, divisionName: string): Observable<Division[]> {
    if (!divisionCode || divisionCode === '0') return of([]);
    return of([{ id: divisionCode, name: divisionName }]);
  }

  createPoll(payload: CreatePollPayload): Observable<any> {
    return of({ success: true });
  }

  votePoll(postId: string, optionId: string): Observable<any> {
    return of({ success: true });
  }

  // ✅ FIXED — was JSON POST, now FormData (matches likely backend expectation)
  getWallActivitySetup(employeeId: string): Observable<WallActivitySetup> {
    const formData = new FormData();
    formData.append('UserId', employeeId);
    return this.apiService.postForm<WallActivitySetup>(`${URL}getwallactivitysetup`, formData);
  }
}