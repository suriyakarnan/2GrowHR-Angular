export interface GetLeaveStatus {
  Created_Date: string;
  Reason: string;
  Leave_Type: string;
  From_Date: string;
  LastUpdt_Date: string;
  To_Date: string;
  No_of_Days: number;
  LStatus: string;
  StusClr: string;
  Rejected_Reason: string;
  Leave_Active_Flag: number;
  Sl_NO: number;
  Emp_Id: string;
  leaveunit: string;
  emp_name: null;
  emp_photo: null;
}

export interface GetLeaveResponse {
  success: boolean;
  data: GetLeaveStatus[];
}

export interface GetLeavePerHistory {
  emp_name: string | null;
  emp_photo: string | null;
  sl_no: number;
  emp_id: string;
  emp_code: string;
  Leave_TypeName: string;
  from_date: string;
  status: string;
  App_Rej_by: string;
  app_rej_dt: string;
  Next_level_Approve: string;
  daytyp: string;
  Reason: string;
  App_by: string;
  Rej_by: string;
  Approved_by: string;
  flag: string | null;
  Rej_Reason: string;
  Rejected_by: string;
  Approved_Date: string;
  Rejected_Date: string;
}

export interface GetLeavePerHistoryResponse {
  success: boolean;
  data: GetLeavePerHistory[];
}

export interface LeaveDurationOption {
  id: string;
  name: string;
  des: string;
}

export interface LeaveType {
  id: number;
  name: string;
  Leave_SName: string;
  COffType: number;
  Balance: number;
  FileUnits: string;
  IsFileEnabled: string;
  LeaveType: string;
  Durallow: string; 
}

export interface GetLeaveTypeResponse {
  success: boolean;
  Data: LeaveType[];   
}

export interface ApplicableDays {
  EmpId: string | null;
  Leave_Id: number | null;
  FromDate: string | null;
  ToDate: string | null;
  Description: string;
  CurrentYearDate: string;
  DateToDisplay: string;
}

export interface GetApplicableDaysResponse {
  success: boolean;
  Data: ApplicableDays[];
}

export interface LeaveDate {
  LevTyp: string;
  Weekname: string;
  Day: string;
  Date: string;
  LeaveName: string | null;
  Precount: number;
  enable: number;
  type: number;
  LeaveCode: number;
  bal: number;
}

export interface GetLeaveDatesResponse {
  success: boolean;
  Head: LeaveDate[];
}

export interface LeaveFormValidatePayload {
  Leave_Type: number;
  LeavePart: string;
  Apply_Days: string;
  From_Date: string;
  To_Date: string;
  LeaveStatus: string;
}

export interface LeaveFormValidateResult {
  Msg: string;
}

export interface LeaveFormValidateResponse {
  Response: LeaveFormValidateResult[];
  success: boolean;
}

export interface LeaveDateDetail {
  date: string;
  interval: string;
  dayType: string;
  dayTypeId: string;
}

export interface LeaveFormPayload {
  Reason: string;
  Leave_Type_Id: number;
  To_Date: string;
  Balance_Days: string;
  Available_Days: string;
  From_Date: string;
  Leave_Type: string;
  Apply_Days: string;
  File: string;
  sfCode: string;
  DateDetails: LeaveDateDetail[];
}

export interface LeaveFormResponse {
  success: boolean;
}

export interface UnapproveLeave {
  Emp_Id: string;
  Emp_code: string;
  emp_name: string;
  leave_TypeName: string;
  Leave_preiod: string;
  Req_Dt: string;
  Cnt: number;
  Sl_No: number;
  leaveupload: string;
  Year: number;
  month: number;
  from_date: string;
  leave_Type: number;
}

export interface GetUnapproveLeaveListResponse {
  success: boolean;
  Data: UnapproveLeave[];
}

export interface LeaveApprovePerAppli {
  Sl_No: number;
  Emp_Id: string;
  emp_name: string;
  Flag: number;
  Reson_Leave: string;
  From_Date: string;
  To_Date: string;
  leave_TypeName: string;
  Leave_Type: number;
  Day_Type: string;
  Cnt: number;
  leaveupload: string;
}

export interface GetLeaveApprovePerAppliResponse {
  success: boolean;
  Data: LeaveApprovePerAppli[];
}

export interface LeaveApproveFinalSaveResponse {
  success: boolean;
  message?: string;
}