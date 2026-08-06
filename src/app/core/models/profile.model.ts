export interface InfoField {
  label: string;
  value: string;
}

export interface InfoPanel {
  title: string;
  colSpan: string;
  leftFields: InfoField[];
  rightFields: InfoField[];
}

export interface AdminEmployeeSummary {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  division: string;
  department: string;
  designation: string;
  city: string;
  reportingTo: string;
  avatar: string;
}