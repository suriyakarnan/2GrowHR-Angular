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


// src/app/core/models/wall-activity.model.ts

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

// Poll types — still mock, not wired yet
export interface Division { id: string; name: string; }
export interface PollOption { id: string; label: string; votes: number; percentage: number; }
export interface CreatePollPayload {
  divisionId: string;
  question: string;
  options: string[];
  expiresOn: string;
}

export interface LikeItem {

        likedId: number;
        likedEmployeeId: string;
        profilePicture: string;
        employeeName: string;
        designation: string;
        organizationName: string;
        likedDate : string;
}

export interface AddLikePayload 
{
    wallPostId: number;
    likedEmployeeId: string;

}

export interface RemoveLikePayload {

    wallPostId: number;
    EmployeeId: string;
}




