// src/app/core/services/wall-activity.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

const BASE_URL = '/api/wallposts';

@Injectable({ providedIn: 'root' })
export class WallActivityService {

  constructor(private http: HttpClient) {}

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
    const formData = new FormData();
    formData.append('EmployeeId', employeeId);
    formData.append('LoadByDivision', loadByDivision.toString());
    return this.http.post<WallPost[]>(`${BASE_URL}/get`, formData);
  }

  getEmployeeMentions(search?: string): Observable<{ success: boolean; data: string[] }> {
    const params: Record<string, string> = search ? { search } : {};
    return this.http.get<{ success: boolean; data: string[] }>(
      `${BASE_URL}/employee-mentions`,
      { params }
    );
  }

  createPost(payload: CreatePostPayload): Observable<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('Orgid',           payload.orgId);
    formData.append('EmployeeId',      payload.employeeId);
    formData.append('DivisionId',      payload.divisionId);
    formData.append('SubDivisionId',   payload.subDivisionId);
    formData.append('DepartmnetId',    payload.departmentId);
    formData.append('WallDescription', payload.content);
    formData.append('UserRole',        'Employee');
    if (payload.imageFile) {
      formData.append('file', payload.imageFile);
    }
    if (payload.mentionedEmpIds?.length) {
      formData.append('mentionedEmpIds', JSON.stringify(payload.mentionedEmpIds));
    }
    return this.http.post<{ success: boolean; message: string }>(`${BASE_URL}/create`, formData);
  }

  deletePost(wallPostId: number): Observable<{ success: boolean }> {
    const formData = new FormData();
    formData.append('PostId', wallPostId.toString());
    formData.append('EmployeeId', this.getEmployeeId());
    formData.append('IsAdmin', 'false');
    return this.http.post<{ success: boolean }>(`${BASE_URL}/delete`, formData);
  }

  getComments(wallPostId: number): Observable<CommentItem[]> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('EmployeeId', this.getEmployeeId());
    return this.http.post<CommentItem[]>(`${BASE_URL}/getcomments`, formData);
  }

  addComment(payload: CreateCommentPayload): Observable<{ success: boolean; message: string; data: CommentItem }> {
    const formData = new FormData();
    formData.append('WallPostId', payload.wallPostId.toString());
    formData.append('CommentedEmployeeId', this.getEmployeeId());
    formData.append('CommentDescription', payload.commentDescription);
    return this.http.post<{ success: boolean; message: string; data: CommentItem }>(
      `${BASE_URL}/comment`,
      formData
    );
  }

  deleteComment(commentId: number, wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('CommentId', commentId.toString());
    formData.append('WallPostId', wallPostId.toString());
    formData.append('CommentedEmployeeId', this.getEmployeeId());
    return this.http.post<{ success: boolean; message?: string }>(
      `${BASE_URL}/deletecomment`,
      formData
    );
  }

  likePost(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('LikedEmployeeId', this.getEmployeeId());
    return this.http.post<{ success: boolean; message?: string }>(`${BASE_URL}/like`, formData);
  }

  removeLike(wallPostId: number): Observable<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('WallPostId', wallPostId.toString());
    formData.append('LikedEmployeeId', this.getEmployeeId());
    return this.http.post<{ success: boolean; message?: string }>(`${BASE_URL}/removelike`, formData);
  }

  getPostLikes(wallPostId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/posts/likes`, {
      params: { wallPostId: wallPostId.toString() }
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
    const formData = new FormData();
    formData.append('UserId', employeeId);
    return this.http.post<WallActivitySetup>(`${BASE_URL}/getwallactivitysetup`, formData);
  }
}