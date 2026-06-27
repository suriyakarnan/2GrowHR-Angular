// src/app/dashboard/wall-activity/wall-activity.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WallActivityService } from '../../../core/services/wall-activity.service';
import {
  WallPost,
  Division,
  CreatePostPayload,
  CreatePollPayload
} from '../../../core/models/wall-activity.model';

@Component({
  selector: 'app-wall-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wall-activity.component.html',
  styleUrls: ['./wall-activity.component.css']
})
export class WallActivityComponent implements OnInit {

  // ── Tab State ─────────────────────────────────────────────
  activeTab: 'post' | 'poll' = 'post';

  // ── Data ──────────────────────────────────────────────────
  divisions: Division[] = [];
  wallPosts: WallPost[] = [];

  // ── Post Form ─────────────────────────────────────────────
  selectedDivisionId: string = '';
  postContent: string = '';
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  // ── Poll Form ─────────────────────────────────────────────
  pollDivisionId: string = '';
  pollQuestion: string = '';
  pollOptions: string[] = ['', ''];   // Min 2 options always
  pollExpiresOn: string = '';

  // ── UI State ──────────────────────────────────────────────
  isSubmitting: boolean = false;

  constructor(private wallService: WallActivityService) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.loadWallPosts();
  }

  // ── Loaders ───────────────────────────────────────────────

  loadDivisions(): void {
    this.wallService.getDivisions().subscribe({
      next: (data) => this.divisions = data,
      error: (err) => console.error('Failed to load divisions:', err)
    });
  }

  loadWallPosts(): void {
    this.wallService.getWallPosts().subscribe({
      next: (data) => this.wallPosts = data,
      error: (err) => console.error('Failed to load posts:', err)
    });
  }

  // ── Tab Switch ────────────────────────────────────────────

  setTab(tab: 'post' | 'poll'): void {
    this.activeTab = tab;
  }

  // ── Image Upload ──────────────────────────────────────────

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  // ── Submit Post ───────────────────────────────────────────

  submitPost(): void {
    if (!this.postContent.trim()) return;

    this.isSubmitting = true;

    const payload: CreatePostPayload = {
      divisionId: this.selectedDivisionId,
      content: this.postContent,
      imageFile: this.selectedImage
    };

    this.wallService.createPost(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.wallPosts.unshift(res.data);   // Add to top of feed
          this.resetPostForm();
        }
        this.isSubmitting = false;
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  resetPostForm(): void {
    this.postContent = '';
    this.selectedDivisionId = '';
    this.selectedImage = null;
    this.imagePreviewUrl = null;
  }

  // ── Poll Options ──────────────────────────────────────────

  addPollOption(): void {
    if (this.pollOptions.length < 5) {
      this.pollOptions.push('');
    }
  }

  removePollOption(index: number): void {
    if (this.pollOptions.length > 2) {
      this.pollOptions.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ── Submit Poll ───────────────────────────────────────────

  submitPoll(): void {
    const validOptions = this.pollOptions.filter(o => o.trim() !== '');
    if (!this.pollQuestion.trim() || validOptions.length < 2 || !this.pollExpiresOn) return;

    this.isSubmitting = true;

    const payload: CreatePollPayload = {
      divisionId: this.pollDivisionId,
      question: this.pollQuestion,
      options: validOptions,
      expiresOn: this.pollExpiresOn
    };

    this.wallService.createPoll(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.wallPosts.unshift(res.data);
          this.resetPollForm();
        }
        this.isSubmitting = false;
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  resetPollForm(): void {
    this.pollQuestion = '';
    this.pollOptions = ['', ''];
    this.pollExpiresOn = '';
    this.pollDivisionId = '';
  }

  // ── Like Toggle ───────────────────────────────────────────

  toggleLike(post: WallPost): void {
    this.wallService.toggleLike(post.id).subscribe({
      next: () => {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
      }
    });
  }

  // ── Vote Poll ─────────────────────────────────────────────

  votePoll(post: WallPost, optionId: string): void {
    this.wallService.votePoll(post.id, optionId).subscribe({
      next: () => {
        if (!post.pollOptions) return;
        post.pollOptions = post.pollOptions.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        post.totalVotes = (post.totalVotes || 0) + 1;
        // Recalculate percentages
        post.pollOptions = post.pollOptions.map(opt => ({
          ...opt,
          percentage: post.totalVotes
            ? Math.round((opt.votes / post.totalVotes!) * 100)
            : 0
        }));
      }
    });
  }
}