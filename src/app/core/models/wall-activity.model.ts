// src/app/core/models/wall-activity.model.ts
// ─────────────────────────────────────────────────────────────
// All interfaces live here. When real API arrives,
// just match these shapes to the API response — zero component changes.
// ─────────────────────────────────────────────────────────────

export interface Division {
  id: string;
  name: string;
}

export interface WallPost {
  id: string;
  type: 'post' | 'poll';
  authorName: string;
  authorInitial: string;
  authorColor?: string;
  timeAgo: string;
  divisionId?: string;

  // Post-specific
  content?: string;
  imageUrl?: string;

  // Poll-specific
  pollQuestion?: string;
  pollOptions?: PollOption[];
  pollExpiresOn?: string;
  totalVotes?: number;

  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

// ── Request Payloads (for future API calls) ──────────────────

export interface CreatePostPayload {
  divisionId: string;
  content: string;
  imageFile?: File | null;
}

export interface CreatePollPayload {
  divisionId: string;
  question: string;
  options: string[];
  expiresOn: string;
}