export interface EmpName {
  empid: string;
  emp_Code: string;
  name: string;
  mName: string;
  lName: string;
  cnt: number;
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  needsSalaryUpdate: boolean;
}

export interface Division {
  div_id: number;
  div_Name: string;
  div_SName: string;
}