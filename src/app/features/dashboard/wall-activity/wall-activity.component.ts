// src/app/dashboard/wall-activity/wall-activity.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WallActivityService } from '../../../core/services/wall-activity.service';
import { SelectpickerDirective } from '../../../shared/components/selectpicker/selectpicker.directive';
import {
  WallPost,
  Division,
  CreatePostPayload,
  CreatePollPayload,
  CommentItem,
  WallActivitySetup
} from '../../../core/models/wall-activity.model';


const IMAGE_BASE = 'http://development.2growhr.io';
const PROF_PIC_BASE = 'http://2growhr.io/Images/EmpUpload/';

@Component({
  selector: 'app-wall-activity',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectpickerDirective],
  templateUrl: './wall-activity.component.html',
  styleUrls: ['./wall-activity.component.css']
})

export class WallActivityComponent implements OnInit {

  @ViewChild('postScopePicker') postScopePicker!: SelectpickerDirective;
  @ViewChild('divisionPicker') divisionPicker!: SelectpickerDirective;

  // ── Tab ───────────────────────────────────────────────────
  activeTab: 'post' | 'poll' = 'post';

  // ── Session ───────────────────────────────────────────────
  employeeId: string   = '';
  orgId: string        = '';
  departmentId: string = '';
  divisionId: string   = '';
  divisionName: string = '';

  // ── Feed ──────────────────────────────────────────────────
  // CONFIRMED via Postman:
  //   LoadByDivision=false → returns posts with departmnetId set → "Organization" button
  //   LoadByDivision=true  → returns posts with divisionId set   → "Department" button
  loadByDivision: boolean = false;

  // ── Data ─────────────────────────────────────────────────
  divisions: Division[] = [];
  wallPosts: WallPost[] = [];

  // ── Post Form ─────────────────────────────────────────────
  postContent: string = '';
  postScope: 'Organization' | 'Department' = 'Organization';
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  // ── Mentions ──────────────────────────────────────────────
  mentionSuggestions: string[] = [];
  showMentionDropdown: boolean = false;
  selectedMentions: string[] = [];

  // ── Comments ──────────────────────────────────────────────
  openCommentsPostId: number | null = null;
  commentsByPost: Record<number, CommentItem[]> = {};
  newCommentText: string = '';

  // ── Poll Form ─────────────────────────────────────────────
  pollDivisionId: string = '';
  pollQuestion: string = '';
  pollOptions: string[] = ['', ''];
  pollExpiresOn: string = '';

  // ── UI ────────────────────────────────────────────────────
  isSubmitting: boolean = false;

  // ── Wall Activity Setup (permissions) ──────────────────────
  activitySetup: WallActivitySetup | null = null;
  canPostOrganization: boolean = true;
  canPostDepartment: boolean = true;

  constructor(private wallService: WallActivityService) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user        = JSON.parse(userStr);
      this.employeeId   = user.Sf_code             || '';
      this.orgId        = String(user.org           || '');
      this.departmentId = String(user.SFDept        || '0');
      this.divisionId   = String(user.Division_Code || '0');
      this.divisionName = user.Division_Name        || '';
    }

    this.loadWallActivitySetup();
    this.loadWallPosts();
  }

  // ── Loaders ───────────────────────────────────────────────

  loadWallPosts(): void {
    if (!this.employeeId) {
      console.warn('No employeeId — cannot load wall posts.');
      return;
    }
    this.wallService.getWallPosts(this.employeeId, this.loadByDivision).subscribe({
      next: (data) => {
        this.wallPosts = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error('Failed to load posts:', err)
    });
  }

  loadWallActivitySetup(): void {
  if (!this.orgId) return;
  this.wallService.getWallActivitySetup(this.orgId).subscribe({ // 👈 employeeId illa, employeeNumericId anுப்பணும்
    next: (setup) => {
      this.activitySetup = setup;
      this.canPostDepartment   = setup.enableDepartmentWall === 1;
      this.canPostOrganization = setup.employeePostContent === 1;
      if (!this.canPostOrganization && this.canPostDepartment) {
        this.postScope = 'Department';
      } else if (this.canPostOrganization) {
        this.postScope = 'Organization';
      }
      setTimeout(() => this.postScopePicker?.refresh());
    },
    error: (err) => console.error('Failed to load wall activity setup:', err)
  });
}
  // ── Image URL helpers ─────────────────────────────────────

  getProfilePicUrl(filename: string): string {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return PROF_PIC_BASE + filename;
  }

  getPostImageUrls(imagePath: string): string[] {
    if (!imagePath) return [];
    return imagePath
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => p.startsWith('http') ? p : IMAGE_BASE + p);
  }

  // ── Feed Scope ────────────────────────────────────────────

  setFeedScope(byDivision: boolean): void {
    if (this.loadByDivision === byDivision) return;
    this.loadByDivision = byDivision;
    this.loadWallPosts();
  }

  setTab(tab: 'post' | 'poll'): void {
    this.activeTab = tab;
  }

  // ── Mentions ──────────────────────────────────────────────

  onContentInput(): void {
    const lastWord = this.postContent.split(/\s/).pop() || '';
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      const search = lastWord.substring(1);
      this.wallService.getEmployeeMentions(search).subscribe({
        next: (res) => {
          this.mentionSuggestions = res.data || [];
          this.showMentionDropdown = this.mentionSuggestions.length > 0;
        },
        error: () => { this.showMentionDropdown = false; }
      });
    } else {
      this.showMentionDropdown = false;
    }
  }

  pickMention(mention: string): void {
    const empId = mention.split(' ')[0];
    const words = this.postContent.split(/\s/);
    words.pop();
    words.push(mention.trim());
    this.postContent = words.join(' ') + ' ';
    this.selectedMentions.push(empId);
    this.showMentionDropdown = false;
  }

  // ── Image Upload ──────────────────────────────────────────

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.imagePreviewUrl = e.target?.result as string; };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  // ── Submit Post ───────────────────────────────────────────
  // postScope === 'Organization' → populate departmentId (confirmed via Postman)
  // postScope === 'Department'   → populate divisionId   (confirmed via Postman)

  submitPost(): void {
    if (!this.postContent.trim()) return;

    if (!this.canPostOrganization && !this.canPostDepartment) {
      alert('You are not allowed to post.');
      return;
    }

    this.isSubmitting = true;

    const payload: CreatePostPayload = {
      orgId:           this.orgId,
      employeeId:      this.employeeId,
      divisionId:      this.postScope === 'Department'   ? this.divisionId   : '',
      subDivisionId:   this.postScope === 'Department'   ? '0'               : '',
      departmentId:    this.postScope === 'Organization' ? this.departmentId : '',
      content:         this.postContent,
      imageFile:       this.selectedImage,
      mentionedEmpIds: this.selectedMentions
    };

    this.wallService.createPost(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadByDivision = this.postScope === 'Department';
          this.loadWallPosts();
          this.resetPostForm();
        } else {
          console.error('Post failed:', res.message);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Create post error:', err);
        this.isSubmitting = false;
      }
    });
  }

  resetPostForm(): void {
    this.postContent      = '';
    this.postScope        = 'Organization';
    this.selectedImage    = null;
    this.imagePreviewUrl  = null;
    this.selectedMentions = [];
  }

  deletePost(post: WallPost): void {
    this.wallService.deletePost(post.wallPostId).subscribe({
      next: (res) => {
        if (res.success) {
          this.wallPosts = this.wallPosts.filter(p => p.wallPostId !== post.wallPostId);
        }
      }
    });
  }

  // ── Poll ──────────────────────────────────────────────────

  addPollOption(): void {
    if (this.pollOptions.length < 5) this.pollOptions.push('');
  }

  removePollOption(index: number): void {
    if (this.pollOptions.length > 2) this.pollOptions.splice(index, 1);
  }

  trackByIndex(index: number): number { return index; }

  submitPoll(): void {
    const validOptions = this.pollOptions.filter(o => o.trim() !== '');
    if (!this.pollQuestion.trim() || validOptions.length < 2 || !this.pollExpiresOn) return;
    this.isSubmitting = true;
    const payload: CreatePollPayload = {
      divisionId: this.pollDivisionId,
      question:   this.pollQuestion,
      options:    validOptions,
      expiresOn:  this.pollExpiresOn
    };
    this.wallService.createPoll(payload).subscribe({
      next: () => { this.resetPollForm(); this.isSubmitting = false; },
      error: ()  => { this.isSubmitting = false; }
    });
  }

  resetPollForm(): void {
    this.pollQuestion   = '';
    this.pollOptions    = ['', ''];
    this.pollExpiresOn  = '';
    this.pollDivisionId = '';
  }

  // ── Like ──────────────────────────────────────────────────

  toggleLike(post: WallPost): void {
    const action$ = post.hasLiked === 'Liked'
      ? this.wallService.removeLike(post.wallPostId)
      : this.wallService.likePost(post.wallPostId);

    action$.subscribe({
      next: (res) => {
        if (res.success) {
          post.hasLiked   = post.hasLiked === 'Liked' ? 'Not Liked' : 'Liked';
          post.likeCount += post.hasLiked === 'Liked' ? 1 : -1;
        }
      }
    });
  }

  // ── Comments ──────────────────────────────────────────────

  toggleComments(post: WallPost): void {
    if (this.openCommentsPostId === post.wallPostId) {
      this.openCommentsPostId = null;
      return;
    }
    this.openCommentsPostId = post.wallPostId;
    if (!this.commentsByPost[post.wallPostId]) {
      this.wallService.getComments(post.wallPostId).subscribe({
        next:  (data) => this.commentsByPost[post.wallPostId] = data,
        error: ()     => this.commentsByPost[post.wallPostId] = []
      });
    }
  }

  submitComment(post: WallPost): void {
    if (!this.newCommentText.trim()) return;
    this.wallService.addComment({
      wallPostId:         post.wallPostId,
      commentDescription: this.newCommentText
    }).subscribe({
      next: (res) => {
        if (res.success) {
          if (!this.commentsByPost[post.wallPostId]) this.commentsByPost[post.wallPostId] = [];
          this.commentsByPost[post.wallPostId].unshift(res.data);
          post.commentCount += 1;
          this.newCommentText = '';
        }
      }
    });
  }

  deleteComment(post: WallPost, comment: CommentItem): void {
    this.wallService.deleteComment(comment.commentId, post.wallPostId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentsByPost[post.wallPostId] =
            this.commentsByPost[post.wallPostId].filter(c => c.commentId !== comment.commentId);
          post.commentCount -= 1;
        }
      }
    });
  }
}