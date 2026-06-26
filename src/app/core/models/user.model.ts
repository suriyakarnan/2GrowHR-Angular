// ============================================================
// FILE: src/app/core/models/user.model.ts
// ============================================================

export interface UserData {
  org: number;
  Sf_UserName: string;
  sf_emp_id: string;
  DeptName: string;
  sf_Designation_Short_Name: string;
  SF_Status: number;
  Sf_Name: string;
  Sf_Password: string;
  Division_Code: number;
  Division_Name: string;
  DisRad: string;
  Lattitude: string;
  Longitude: string;
  Sf_code: string;
  CheckCount: string;
  HQCode: string;
  THrsPerm: string;
  Profile: string;
  ProfPath: string;
  imageCaptureNeed: number;
  cameraFlip: number;
  LocBasedCheckNeed: number;
  mobile_check_in: number;
  portalAccess: number;
  Shift_Selection: number;
  Mode: number;
}

export interface LoginResponse {
  success: boolean;
  Data: UserData[];
  BlockMsg: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  Data: T;
  BlockMsg?: string;
  message?: string;
}