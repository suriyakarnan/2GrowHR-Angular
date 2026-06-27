// src/app/core/services/wall-activity.service.ts
// ─────────────────────────────────────────────────────────────
// ALL API calls for Wall Activity are here.
// Component never touches ApiService directly.
// When real API arrives → update ONLY this file.
// ─────────────────────────────────────────────────────────────

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import {
  WallPost,
  Division,
  CreatePostPayload,
  CreatePollPayload
} from '../models/wall-activity.model';

// ── MOCK DATA (remove when real API is ready) ────────────────
const MOCK_DIVISIONS: Division[] = [
  { id: '1', name: 'HR Department' },
  { id: '2', name: 'Engineering' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Marketing' },
];

const MOCK_POSTS: WallPost[] = [
  {
    id: '1',
    type: 'post',
    authorName: 'Admin',
    authorInitial: 'A',
    authorColor: '#405189',
    timeAgo: '21 Hours ago',
    content: 'Welcome to the new Wall Activity space!',
    // imageUrl: null,
    likesCount: 3,
    commentsCount: 1,
    isLiked: false,
  },
  {
    id: '2',
    type: 'poll',
    authorName: 'Venky vv',
    authorInitial: 'V',
    authorColor: '#405189',
    timeAgo: '5 Days ago',
    pollQuestion: 'sdsdvwedf',
    pollOptions: [
      { id: 'o1', label: '1', votes: 0, percentage: 0 },
      { id: 'o2', label: '2', votes: 0, percentage: 0 },
    ],
    pollExpiresOn: '23-06-2026',
    totalVotes: 0,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
  },
];

@Injectable({ providedIn: 'root' })
export class WallActivityService {

  constructor(private apiService: ApiService) {}

  // ── GET: Divisions ────────────────────────────────────────
  // TODO (Real API): return this.apiService.get<Division[]>('GetDivisionList');
  getDivisions(): Observable<Division[]> {
    return of(MOCK_DIVISIONS);
  }

  // ── GET: All Wall Posts ───────────────────────────────────
  // TODO (Real API): return this.apiService.get<WallPost[]>('GetWallPosts');
  getWallPosts(): Observable<WallPost[]> {
    return of(MOCK_POSTS);
  }

  // ── POST: Create a Text Post ──────────────────────────────
  // TODO (Real API):
  // const formData = new FormData();
  // formData.append('content', payload.content);
  // if (payload.imageFile) formData.append('image', payload.imageFile);
  // return this.apiService.postForm<any>('CreateWallPost', formData, { divisionId: payload.divisionId });
  createPost(payload: CreatePostPayload): Observable<any> {
    const newPost: WallPost = {
      id: Date.now().toString(),
      type: 'post',
      authorName: 'Admin',
      authorInitial: 'A',
      authorColor: '#405189',
      timeAgo: 'Just now',
      content: payload.content,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
    return of({ success: true, data: newPost });
  }

  // ── POST: Create a Poll ───────────────────────────────────
  // TODO (Real API):
  // return this.apiService.post<any>('CreatePoll', { divisionId: payload.divisionId }, payload);
  createPoll(payload: CreatePollPayload): Observable<any> {
    const newPoll: WallPost = {
      id: Date.now().toString(),
      type: 'poll',
      authorName: 'Admin',
      authorInitial: 'A',
      authorColor: '#405189',
      timeAgo: 'Just now',
      pollQuestion: payload.question,
      pollOptions: payload.options.map((opt, i) => ({
        id: `o${i}`,
        label: opt,
        votes: 0,
        percentage: 0,
      })),
      pollExpiresOn: payload.expiresOn,
      totalVotes: 0,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
    return of({ success: true, data: newPoll });
  }

  // ── POST: Toggle Like ─────────────────────────────────────
  // TODO (Real API): return this.apiService.post<any>('ToggleLike', { postId });
  toggleLike(postId: string): Observable<any> {
    return of({ success: true });
  }

  // ── POST: Vote on Poll ────────────────────────────────────
  // TODO (Real API): return this.apiService.post<any>('VotePoll', { postId, optionId });
  votePoll(postId: string, optionId: string): Observable<any> {
    return of({ success: true });
  }
}