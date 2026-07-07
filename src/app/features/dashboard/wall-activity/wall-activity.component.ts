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
  CommentItem,
  CreateCommentPayload,
  WallActivitySetup,
  LikeItem,
  LikeActionResponse,
  WallPoll,
  CreatePollPayload,
  PollCommentItem,
  ParsedPollOptionVote
} from '../../../core/models/wall-activity.model';


const IMAGE_BASE = 'http://development.2growhr.io';
const PROF_PIC_BASE = 'http://2growhr.io/Images/EmpUpload/';

type FeedItem =
  | { type: 'post'; createdAt: string; post: WallPost }
  | { type: 'poll'; createdAt: string; poll: WallPoll };

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

  @ViewChild('pollScopePicker') pollScopePicker!: SelectpickerDirective;

  // ── Tab ───────────────────────────────────────────────────
  activeTab: 'post' | 'poll' = 'post';

  // ── Session ───────────────────────────────────────────────
  employeeId: string   = '';
  orgId: string        = '';
  departmentId: string = '';
  divisionId: string   = '';
  divisionName: string = '';

  
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

  openLikesPostId: number | null = null;
  likesByPost: Record<number, LikeItem[]> = {};

  

  // ── UI ────────────────────────────────────────────────────
  isSubmitting: boolean = false;

  // ── Wall Activity Setup (permissions) ──────────────────────
  activitySetup: WallActivitySetup | null = null;
  canPostOrganization: boolean = false;
  canPostDepartment: boolean = false;

  brokenImages = new Set<string>();

  wallPolls: WallPoll[] = [];
  feedItems: FeedItem[] = [];

  pollScope: 'Organization' | 'Department' = 'Organization';
  pollQuestion: string = '';
  pollOptions: string[] = ['', ''];
  pollExpiresOn: string = '';
  isSubmittingPoll: boolean = false;
  canPostPoll: boolean = false;

  openPollCommentsId: number | null = null;
  pollCommentsByPoll: Record<number, PollCommentItem[]> = {};
  newPollCommentText: string = '';

  openPollLikesId: number | null = null;
  pollLikesByPoll: Record<number, LikeItem[]> = {};

  userRole: string = 'Employee';

  

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
    this.loadPolls();
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
        this.rebuildFeed();
      },
      error: (err) => console.error('Failed to load posts:', err)
    });
  }

  loadWallActivitySetup(): void {
  if (!this.orgId) return;
  this.wallService.getWallActivitySetup(this.orgId).subscribe({ 
    next: (setup) => {
      console.log('🔍 API Response:', setup);
      this.activitySetup = setup;
      this.canPostDepartment   = Number(setup.enableDepartmentWall) === 1;
      this.canPostOrganization = Number(setup.employeePostContent) === 1;
      this.canPostPoll         = Number(setup.employeePollContent) === 1;
      console.log('🔍 canPostOrganization:', this.canPostOrganization);
      console.log('🔍 canPostDepartment:', this.canPostDepartment);
      if (!this.canPostOrganization && this.canPostDepartment) {
        this.postScope = 'Department';
      } else if (this.canPostOrganization) {
        this.postScope = 'Organization';
      }
      this.pollScope = this.postScope;
      
      setTimeout(() => {                             // ← REPLACE the old
        this.postScopePicker?.refresh();              //   single-line setTimeout
        this.pollScopePicker?.refresh();               //   with this block
      }, 100);
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
  this.loadPolls(); 
}

  setTab(tab: 'post' | 'poll'): void {
  this.activeTab = tab;
  setTimeout(() => {
    if (tab === 'poll') {
      this.pollScopePicker?.refresh();
    } else {
      this.postScopePicker?.refresh();
    }
  }, 0);
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

  

  submitPost(): void {

    console.log('🔍 postScope:', this.postScope, '| canPostOrganization:', this.canPostOrganization);
    if (!this.postContent.trim()) return;

    if (!this.canPostOrganization && !this.canPostDepartment) {
      alert('You are not allowed to post.');
      return;
    }

    
    if (this.postScope === 'Organization' && !this.canPostOrganization) {
      alert('You are not allowed to post in Organization.');
      return;
    }
    if (this.postScope === 'Department' && !this.canPostDepartment) {
      alert('You are not allowed to post in Department.');
      return;
    }

    this.isSubmitting = true;

    const payload: CreatePostPayload = {
      orgId:           this.orgId,
      employeeId:      this.employeeId,
      divisionId:      this.postScope === 'Organization' ? this.divisionId   : '',
      subDivisionId:   this.postScope === 'Organization' ? '0'               : '',
      departmentId:    this.postScope === 'Department'   ? this.departmentId : '',
      content:         this.postContent,
      imageFile:       this.selectedImage,
      mentionedEmpIds: this.selectedMentions
    };

    this.wallService.createPost(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadByDivision = this.postScope === 'Organization';
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
          this.rebuildFeed();
        }
      }
    });
  }

  trackByIndex(index: number): number { return index; }


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

  trackByPostId(index: number, post: WallPost): number {
    return post.wallPostId;
  }

  toggleLikes(post: WallPost): void {
  const targetId = post.wallPostId; // capture immediately, avoid any later reference drift

  if (this.openLikesPostId === targetId) {
    this.openLikesPostId = null;
    return;
  }
  this.openLikesPostId = targetId;

  console.log('🔍 Fetching likes for wallPostId:', targetId); // TEMP — confirm this changes per click

  this.wallService.getLikePost(targetId).subscribe({
    next: (data) => {
      console.log('🔍 Likes API response for', targetId, ':', data); // TEMP
      this.likesByPost[targetId] = data;
    },
    error: () => this.likesByPost[targetId] = []
  });
}

  SubmitLike(post: WallPost): void {
    // This is the actual thumbs-up click — adds or removes the like
    const wasLiked = post.hasLiked === 'Liked';

    // Optimistic UI update — feels instant, reverted on failure
    post.hasLiked = wasLiked ? 'Not Liked' : 'Liked';
    post.likeCount += wasLiked ? -1 : 1;

    const request$ = wasLiked
      ? this.wallService.removeLike(post.wallPostId, this.employeeId)
      : this.wallService.addLike(post.wallPostId, this.employeeId);

    request$.subscribe({
      next: (res) => {
        if (!res.success) {
          // revert if backend rejected it
          post.hasLiked = wasLiked ? 'Liked' : 'Not Liked';
          post.likeCount += wasLiked ? 1 : -1;
          return;
        }
        if (typeof res.likeCount === 'number') {
          post.likeCount = res.likeCount; // trust server's true count
        }
        // Invalidate cached likers list so the modal refetches next time it opens
        delete this.likesByPost[post.wallPostId];
      },
      error: () => {
        // revert on network failure
        post.hasLiked = wasLiked ? 'Liked' : 'Not Liked';
        post.likeCount += wasLiked ? 1 : -1;
      }
    });
  }

  isImageBroken(url: string): boolean {
    return this.brokenImages.has(url);
  }

  markImageBroken(url: string): void {
    this.brokenImages.add(url);
  }

  loadPolls(): void {
    if (!this.employeeId) return;
    this.wallService.getPolls(this.employeeId, this.loadByDivision).subscribe({
      next: (data) => {
         console.log('🔍 raw polls response:', data);
        this.wallPolls = Array.isArray(data) ? data : [];
         console.log('🔍 wallPolls after assign:', this.wallPolls);
        this.rebuildFeed();
        console.log('🔍 feedItems after rebuild:', this.feedItems);
      },
      error: (err) => console.error('Failed to load polls:', err)
    });
  }

  private rebuildFeed(): void {
    const postItems: FeedItem[] = this.wallPosts.map(post => ({ type: 'post', createdAt: post.createdAt, post }));
    const pollItems: FeedItem[] = this.wallPolls.map(poll => ({ type: 'poll', createdAt: poll.createdAt, poll }));
    this.feedItems = [...postItems, ...pollItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  trackByFeedItem(index: number, item: FeedItem): string {
    return item.type === 'post' ? `post-${item.post.wallPostId}` : `poll-${item.poll.pollId}`;
  }

  addPollOption(): void {
    if (this.pollOptions.length < 5) this.pollOptions.push('');
  }

  removePollOption(index: number): void {
    if (this.pollOptions.length > 2) this.pollOptions.splice(index, 1);
  }

  getParsedPollOptions(poll: WallPoll): ParsedPollOptionVote[] {
    if (!poll.optionVotesJson) return [];
    try {
      return JSON.parse(poll.optionVotesJson) as ParsedPollOptionVote[];
    } catch {
      return [];
    }
  }

  getPollTotalVotes(poll: WallPoll): number {
    return this.getParsedPollOptions(poll).reduce((sum, o) => sum + (o.VoteCount || 0), 0);
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (diffMs < 0) return 'just now';
    const minute = 60000, hour = 60 * minute, day = 24 * hour;
    const minutes = Math.floor(diffMs / minute);
    const hours = Math.floor(diffMs / hour);
    const days = Math.floor(diffMs / day);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} Minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} Hour${hours === 1 ? '' : 's'} ago`;
    return `${days} Day${days === 1 ? '' : 's'} ago`;
  }

  submitPoll(): void {

    console.log('🔍 pollScope at submit time:', this.pollScope); 

    if (!this.canPostPoll) { alert('You are not allowed to create polls.'); return; }
    if (!this.pollQuestion.trim()) { alert('Please enter a poll question.'); return; }
      

    const trimmedOptions = this.pollOptions.map(o => o.trim()).filter(o => o.length > 0);
  if (trimmedOptions.length < 2) { alert('Please provide at least 2 options.'); return; }
  if (!this.pollExpiresOn) { alert('Please select an expiry date.'); return; }
   
const now = new Date().toISOString();

    this.isSubmittingPoll = true;
        const payload: CreatePollPayload = {
        Createdby: this.employeeId,
        PollName: this.pollQuestion,
        Options: trimmedOptions.join(', '),
        DivisionIds: this.pollScope === 'Organization' ? this.divisionId : '0',
        SubDivisionIds: '0',
        Department: this.pollScope === 'Department' ? this.departmentId : '0',
        ExpiryDate: this.pollExpiresOn,
        UserRole: this.userRole,       // e.g. 'Employee'
        OrgId: this.orgId,
        LikeCount: '0',
        CreatedOn: now,
        ModifiedAt: now
    };

    this.wallService.createPoll(payload).subscribe({
      next: (res: any) => {
        const succeeded = res.success ?? res.Success ?? (res.status === 'success');
        if (succeeded) {
          this.loadByDivision = this.pollScope === 'Organization';   // ← flipped from 'Department'
          this.loadPolls();
          this.resetPollForm();
        } else {
          console.error('Poll creation failed:', res.message);
        }
        this.isSubmittingPoll = false;
      },
      error: (err) => { console.error('Create poll error:', err); this.isSubmittingPoll = false; }
    });
  }

  resetPollForm(): void {
    this.pollQuestion = '';
    this.pollOptions = ['', ''];
    this.pollExpiresOn = '';
    this.pollScope = 'Organization';
  }

  deletePoll(poll: WallPoll): void {
    this.wallService.deletePoll(poll.pollId).subscribe({
      next: (res) => {
        if (res.success) {
          this.wallPolls = this.wallPolls.filter(p => p.pollId !== poll.pollId);
          this.rebuildFeed();
        }
      }
    });
  }

  togglePollLikes(poll: WallPoll): void {
    const targetId = poll.pollId;
    if (this.openPollLikesId === targetId) { this.openPollLikesId = null; return; }
    this.openPollLikesId = targetId;
    this.wallService.getPollLikes(targetId).subscribe({
      next: (data) => { this.pollLikesByPoll[targetId] = data; },
      error: () => this.pollLikesByPoll[targetId] = []
    });
  }

  submitPollLike(poll: WallPoll): void {
    const wasLiked = poll.hasLiked === 'Liked';
    poll.hasLiked = wasLiked ? 'Not Liked' : 'Liked';
    poll.likeCount += wasLiked ? -1 : 1;

    const request$ = wasLiked
      ? this.wallService.removePollLike(poll.pollId, this.employeeId)
      : this.wallService.addPollLike(poll.pollId, this.employeeId);

    request$.subscribe({
      next: (res) => {
        if (!res.success) {
          poll.hasLiked = wasLiked ? 'Liked' : 'Not Liked';
          poll.likeCount += wasLiked ? 1 : -1;
          return;
        }
        const count = res.likesCount ?? res.likeCount;
        if (typeof count === 'number') poll.likeCount = count;
        delete this.pollLikesByPoll[poll.pollId];
      },
      error: () => {
        poll.hasLiked = wasLiked ? 'Liked' : 'Not Liked';
        poll.likeCount += wasLiked ? 1 : -1;
      }
    });
  }

  togglePollComments(poll: WallPoll): void {
    if (this.openPollCommentsId === poll.pollId) { this.openPollCommentsId = null; return; }
    this.openPollCommentsId = poll.pollId;
    if (!this.pollCommentsByPoll[poll.pollId]) {
      this.wallService.getPollComments(poll.pollId).subscribe({
        next: (data) => this.pollCommentsByPoll[poll.pollId] = data,
        error: () => this.pollCommentsByPoll[poll.pollId] = []
      });
    }
  }

  submitPollComment(poll: WallPoll): void {
    if (!this.newPollCommentText.trim()) return;
    this.wallService.addPollComment({
      pollId: poll.pollId,
      commentDescription: this.newPollCommentText
    }).subscribe({
      next: (res) => {
        if (res.success) {
          if (!this.pollCommentsByPoll[poll.pollId]) this.pollCommentsByPoll[poll.pollId] = [];
          this.pollCommentsByPoll[poll.pollId].unshift(res.data);
          poll.commentCount += 1;
          this.newPollCommentText = '';
        }
      }
    });
  }

  get visibleFeedItems(): FeedItem[] {
  return this.feedItems.filter(item =>
    this.activeTab === 'post' ? item.type === 'post' : item.type === 'poll'
  );
}

  get isPollFormValid(): boolean {
    const validOptions = this.pollOptions.map(o => o.trim()).filter(o => o.length > 0);
    return this.pollQuestion.trim().length > 0 && validOptions.length >= 2 && !!this.pollExpiresOn;
  }

  
}