  // src/app/core/services/wall-activity.service.ts

  import { Injectable, inject } from '@angular/core';
  import { Observable, of } from 'rxjs';
  import {
    WallPost,
    Division,
    CreatePostPayload,
    CommentItem,
    CreateCommentPayload,
    WallActivitySetup,
    LikeItem,
    LikeActionResponse,
    WallPoll,
    CreatePollPayload,
    PollCommentItem,
    CreatePollCommentPayload,
    PollStatsResponse,
    EditPollCommentPayload,
    DeletePollCommentPayload,
    SaveVotePayload,
    SaveVoteResponse

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

    // ✅ FIXED — was JSON POST, now FormData (matches likely backend expectation)
    getWallActivitySetup(employeeId: string): Observable<WallActivitySetup> {
      const formData = new FormData();
      formData.append('UserId', employeeId);
      return this.apiService.postForm<WallActivitySetup>(`${URL}getwallactivitysetup`, formData);
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
    formData.append('UserRole','Employee');

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

    getLikePost(wallPostId: number): Observable<LikeItem[]> {
      const formData = new FormData();
      formData.append('WallPostId', wallPostId.toString());
      return this.apiService.postForm<LikeItem[]>(`${URL}posts/likes`, formData);
    }

    addLike(wallPostId: number, likedEmployeeId: string): Observable<LikeActionResponse> {
      const formData = new FormData();
      formData.append('WallPostId', wallPostId.toString());
      formData.append('LikedEmployeeId', likedEmployeeId);
      return this.apiService.postForm<LikeActionResponse>(`${URL}like`, formData);
    }

    removeLike(wallPostId: number, employeeId: string): Observable<LikeActionResponse> {
      const formData = new FormData();
      formData.append('WallPostId', wallPostId.toString());
      formData.append('EmployeeId', employeeId); // exact casing per backend/Postman
      return this.apiService.postForm<LikeActionResponse>(`${URL}removelike`, formData);
    }

    getDivisions(divisionCode: string, divisionName: string): Observable<Division[]> {
      if (!divisionCode || divisionCode === '0') return of([]);
      return of([{ id: divisionCode, name: divisionName }]);
    }

    // ── Poll ─────────────────────────────────────────────────

    /** POST getpoll — mirrors getWallPosts pattern (EmployeeId + LoadByDivision) */
    getPolls(employeeId: string, loadByDivision: boolean = false): Observable<WallPoll[]> {
      const formData = new FormData();
      formData.append('EmployeeId', employeeId);
      formData.append('LoadByDivision', loadByDivision.toString());
      return this.apiService.postForm<WallPoll[]>(`${URL}getpoll`, formData);
    }

    createPoll(payload: CreatePollPayload): Observable<{ success: boolean; message: string }> {
      const formData = new FormData();
      formData.append('Createdby', payload.Createdby);
      formData.append('PollName', payload.PollName);
      formData.append('Options', payload.Options);
      formData.append('DivisionIds', payload.DivisionIds);
      formData.append('SubDivisionIds', payload.SubDivisionIds);
      formData.append('Department', payload.Department);
      formData.append('ExpiryDate', payload.ExpiryDate);
      formData.append('UserRole', payload.UserRole);
      formData.append('OrgId', payload.OrgId);
      formData.append('LikeCount', payload.LikeCount);
      formData.append('CreatedOn', payload.CreatedOn);
      formData.append('ModifiedAt', payload.ModifiedAt);

      return this.apiService.postForm<{ success: boolean; message: string }>(`${URL}createpoll`, formData);
    }

    deletePoll(pollId: number): Observable<{ success: boolean; message: string }> {
      const formData = new FormData();
      formData.append('pollId', pollId.toString());
      formData.append('currentEmployeeId', this.getEmployeeId());
      formData.append('IsAdmin', 'false');
      return this.apiService.postForm<{ success: boolean; message: string }>(`${URL}deletepoll`, formData);
    }

    getPollLikes(pollId: number): Observable<LikeItem[]> {
      const formData = new FormData();
      formData.append('PollId', pollId.toString());
      return this.apiService.postForm<LikeItem[]>(`${URL}polls/likes/list`, formData);
    }

    addPollLike(pollId: number, likedEmployeeId: string): Observable<LikeActionResponse> {
      const formData = new FormData();
      formData.append('PollId', pollId.toString());
      formData.append('LikedEmployeeId', likedEmployeeId);
      return this.apiService.postForm<LikeActionResponse>(`${URL}polls/likes`, formData);
    }

    removePollLike(pollId: number, employeeId: string): Observable<LikeActionResponse> {
      const formData = new FormData();
      formData.append('PollId', pollId.toString());
      formData.append('EmployeeId', employeeId);
      return this.apiService.postForm<LikeActionResponse>(`${URL}removelikepoll`, formData);
    }

    getPollComments(pollId: number): Observable<PollCommentItem[]> {
      const formData = new FormData();
      formData.append('PollId', pollId.toString());
      return this.apiService.postForm<PollCommentItem[]>(`${URL}commentspoll/get`, formData);
    }

    addPollComment(payload: CreatePollCommentPayload): Observable<{ success: boolean; message: string; data: PollCommentItem }> {
      const formData = new FormData();
      formData.append('PollId', payload.pollId.toString());
      formData.append('CommentedEmployeeId', this.getEmployeeId());
      formData.append('CommentDescription', payload.commentDescription);
      formData.append('MentionEmployee', payload.mentionEmployee || '');
      return this.apiService.postForm<{ success: boolean; message: string; data: PollCommentItem }>(
        `${URL}addcommentspoll`,
        formData
      );
    }

    getPollStats(employeeId: string, pollId: number): Observable<PollStatsResponse> {
      const formData = new FormData();
      formData.append('EmployeeId', employeeId);
      formData.append('PollId', pollId.toString());
      return this.apiService.postForm<PollStatsResponse>(`${URL}pollstats`, formData);
    }
    
    editPollComment(payload: EditPollCommentPayload) {
    const formData = new FormData();
    formData.append('UserId', payload.UserId);
    formData.append('CommentId', String(payload.CommentId));
    formData.append('PollId', String(payload.PollId));
    formData.append('CommentDescription', payload.CommentDescription);
    if (payload.CommentedEmployeeId) formData.append('CommentedEmployeeId', payload.CommentedEmployeeId);
    if (payload.MentionEmployee) formData.append('MentionEmployee', payload.MentionEmployee);

    return this.apiService.postForm<{ success: boolean; message: string }>(
      `${URL}commentspoll/edit`, formData
    );
  }

  deletePollComment(payload: DeletePollCommentPayload) {
    const formData = new FormData();
    formData.append('UserId', payload.UserId);
    formData.append('CommentId', String(payload.CommentId));
    formData.append('PollId', String(payload.PollId));
    formData.append('CommentedEmployeeId', payload.CommentedEmployeeId);

    return this.apiService.postForm<{ success: boolean; message: string }>(
      `${URL}commentspoll/delete`, formData
    );
  }

  saveVote(payload: SaveVotePayload) {
    const formData = new FormData();
    formData.append('UserId', payload.UserId);
    formData.append('PollId', String(payload.PollId));
    formData.append('OptionId', String(payload.OptionId));
    formData.append('EmployeeId', payload.EmployeeId);

    return this.apiService.postForm<SaveVoteResponse>(
      `${URL}polls/votes/save`, formData    
    );
  }

    
  }