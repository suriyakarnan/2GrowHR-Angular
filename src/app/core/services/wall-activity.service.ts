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

// 🔑 Only the relative path segment lives here — domain comes from ApiService/environment
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

  getWallPosts(employeeId: string, loadByDivision: boolean = false): Observable<WallPost[]> {
    return this.apiService.get<WallPost[]>(`${URL}get`, {
      EmployeeId: employeeId,
      LoadByDivision: loadByDivision.toString()
    });
  }

  getEmployeeMentions(search?: string): Observable<{ success: boolean; data: string[] }> {
    return this.apiService.get<{ success: boolean; data: string[] }>(
      `${URL}employee-mentions`,
      search ? { search } : {}
    );
  }

  createPost(payload: CreatePostPayload): Observable<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('Orgid',           payload.orgId);
    formData.append('EmployeeId',      payload.employeeId);
    formData.append('DivisionId',      payload.divisionId);
    formData.append('SubDivisionId',   payload.subDivisionId);
    formData.append('DepartmentId',    payload.departmentId); // ✅ typo fixed (was 'DepartmnetId')
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
    return this.apiService.post<{ success: boolean }>(`${URL}delete`, {
      PostId: wallPostId.toString(),
      EmployeeId: this.getEmployeeId(),
      IsAdmin: 'false'
    });
  }

  getComments(wallPostId: number): Observable<CommentItem[]> {
    return this.apiService.get<CommentItem[]>(`${URL}getcomments`, {
      WallPostId: wallPostId.toString(),
      EmployeeId: this.getEmployeeId()
    });
  }

  addComment(payload: CreateCommentPayload): Observable<{ success: boolean; message: string; data: CommentItem }> {
    return this.apiService.post<{ success: boolean; message: string; data: CommentItem }>(`${URL}comment`, {
      WallPostId: payload.wallPostId.toString(),
      CommentedEmployeeId: this.getEmployeeId(),
      CommentDescription: payload.commentDescription
    });
  }

  deleteComment(commentId: number, wallPostId: number): Observable<{ success: boolean; message?: string }> {
    return this.apiService.post<{ success: boolean; message?: string }>(`${URL}deletecomment`, {
      CommentId: commentId.toString(),
      WallPostId: wallPostId.toString(),
      CommentedEmployeeId: this.getEmployeeId()
    });
  }

  likePost(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    return this.apiService.post<{ success: boolean; message?: string }>(`${URL}like`, {
      WallPostId: wallPostId.toString(),
      LikedEmployeeId: this.getEmployeeId()
    });
  }

  removeLike(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    return this.apiService.post<{ success: boolean; message?: string }>(`${URL}removelike`, {
      WallPostId: wallPostId.toString(),
      LikedEmployeeId: this.getEmployeeId()
    });
  }

  getPostLikes(wallPostId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${URL}posts/likes`, {
      wallPostId: wallPostId.toString()
    });
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

  // NOTE: verify in Postman whether this endpoint expects "UserId" with the
  // employee code (EMP26063) or the org id (36) — currently using employeeId.
  getWallActivitySetup(employeeId: string): Observable<WallActivitySetup> {
    return this.apiService.post<WallActivitySetup>(`${URL}getwallactivitysetup`, {
      UserId: employeeId
    });
  }
}