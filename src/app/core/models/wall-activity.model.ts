export interface WallActivitySetup {
  orgId: number;
  divisionId: number;
  subdivisionId: number;
  department: number;
  enableDepartmentWall: number;
  employeePostContent: number;
  employeePollContent: number;
  employeePostAnnouncement: number;
  hide_birthday: number;
}



export interface WallPost {
  wallPostId: number;
  employeeId: string;
  employeeName: string;
  divisionId: number | null;
  divisionIds: number[] | null;
  subDivisionId: number;
  departmnetId: number;
  wallDescription: string;
  imagePath: string;
  createdAt: string;
  modifiedAt: string;
  userRole: string;
  flag: number;
  profilePicturePath: string;
  orgId: number;
  likeCount: number;
  commentCount: number;
  likedEmployeeId: string | null;
  likedEmployeeDesignation: string | null;
  likedEmployeeName: string | null;
  hasLiked: 'Liked' | 'Not Liked';
  likedEmployeesProfilePicture: string | null;
  designationName: string;
  mentionedEmpIds: string | null;
}

export interface CreatePostPayload {
  orgId: string;
  employeeId: string;
  divisionId: string;
  subDivisionId: string;
  departmentId: string;   // sent as "DepartmnetId" to match backend's typo
  content: string;
  imageFile: File | null;
  mentionedEmpIds?: string[];
}

export interface CommentItem {
  commentId: number;
  wallPostId: number;
  commentedEmployeeId: string;
  commentDescription: string;
  commentedOn: string;
  isEdited: boolean;
  isDeleted: boolean;
  modifiedOn: string | null;
  employeeName: string;
  employeeProfilePic: string;
  employeeDesignation: string;
  mentionEmployee: string | null;
}

export interface CreateCommentPayload {
  wallPostId: number;
  commentDescription: string;
  mentionEmployee?: string | null;
}



export interface LikeItem {
  likedId: number;
  likedEmployeeId: string;
  profilePicture: string;
  employeeName: string;
  designation: string;
  organizationName: string;
  likedDate: string;
}

export interface AddLikePayload {
  wallPostId: number;
  likedEmployeeId: string;
}

export interface RemoveLikePayload {
  wallPostId: number;
  employeeId: string;
}

// NEW — matches your Postman response { success, message, likeCount }
export interface LikeActionResponse {
  success: boolean;
  message: string;
  likeCount?: number;
  likesCount?: number;
}

export interface Division { id: string; name: string; }

// ── Poll — wired to real API ────────────────────────────────

export interface WallPoll {
  pollId: number;
  employeeId: string;
  employeeName: string;
  divisionIds: number | null;
  subDivisionIds: number | null;
  departmnetId: number | null;
  createdAt: string;
  modifiedAt: string;
  userRole: string;
  flag: number;
  profilePicturePath: string;
  orgId: number;
  likeCount: number;
  commentCount: number;
  hasLiked: 'Liked' | 'Not Liked';
  designationName: string;
  pollName: string;
  expiryDate: string;
  optiontext: string;
  hasVoted: string;
  userSelectedOption: string;
  voteCount: number;
  /** JSON-encoded string — parse with JSON.parse to get ParsedPollOptionVote[] */
  optionVotesJson: string;
}

export interface ParsedPollOptionVote {
  OptionId: number;
  OptionText: string;
  VoteCount: number;
  Percentage: number;
}

export interface CreatePollPayload {
  Createdby: string;
  PollName: string;
  Options: string;
  DivisionIds: string;
  SubDivisionIds: string;
  Department: string;
  ExpiryDate: string;
  UserRole: string;
  OrgId: string;
  LikeCount: string;
  CreatedOn: string;
  ModifiedAt: string;
}

export interface PollCommentItem {
  commentId: number;
  pollId: number;
  commentedEmployeeId: string;
  commentDescription: string;
  commentedOn: string;
  employeeName: string;
  employeeProfilePic: string;
  employeeDesignation: string;
  mentionEmployee: string | null;
}

export interface CreatePollCommentPayload {
  pollId: number;
  commentDescription: string;
  mentionEmployee?: string | null;
}

export interface PollStatsOption {
  optionText: string;
  voteCount: number;
  percentage: number;
}

export interface PollVoteDetail {
  employeeName: string;
  selectedOption: string;
}

export interface PollStatsData {
  pollId: number;
  pollName: string;
  employeeName: string;
  createdDate: string;
  endDate: string;
  likeCount: number;
  commentCount: number;
  totalVoters: number;
  options: PollStatsOption[];
  voteDetails: PollVoteDetail[];
  profilePicturePath: string;
}

export interface PollStatsResponse {
  success: boolean;
  data: PollStatsData;
}




