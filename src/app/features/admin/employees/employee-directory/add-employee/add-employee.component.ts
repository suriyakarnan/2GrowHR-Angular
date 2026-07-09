import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// TODO: update these two paths to wherever the directives actually live in your project
import { SelectpickerDirective } from '../../../../../shared/components/selectpicker/selectpicker.directive';
import { DatePickerDirective } from '../../../../../shared/components/datepicker/date-picker.directive';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectpickerDirective, DatePickerDirective],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css',
              './add-employee-step2.component.css',
              './add-employee-step3.component.css']
})
export class AddEmployeeComponent {
  currentStep = 1;
  totalSteps = 3;

  steps = [
    { number: 1, label: 'Basic Details' },
    { number: 2, label: 'Personal Details' },
    { number: 3, label: 'Salary Details' }
  ];

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  familyRows: Array<{
    name: string; relationship: string;
    mobileNumber: string; dob: string; aadhaar: string;
  }> = [{ name: '', relationship: '', mobileNumber: '', dob: '', aadhaar: '' }];

  experienceList: Array<{
    experienceYears: string; companyName: string; jobTitle: string;
    dateOfJoining: string; dateOfRelieving: string; location: string;
  }> = [{ experienceYears: '', companyName: '', jobTitle: '', dateOfJoining: '', dateOfRelieving: '', location: '' }];

  educationList: Array<{
    degree: string; branch: string; university: string;
    dateOfJoining: string; dateOfCompletion: string; location: string;
  }> = [{ degree: '', branch: '', university: '', dateOfJoining: '', dateOfCompletion: '', location: '' }];

  constructor(private fb: FormBuilder, private router: Router) {

    this.step1Form = this.fb.group({
      employeeCode:       [{ value: '', disabled: true }],
      division:           ['', Validators.required],
      subDivision:        [''],
      jobType:            ['', Validators.required],
      salutation:         [''],
      firstName:          ['', Validators.required],
      middleName:         [''],
      lastName:           [''],
      fathersName:        ['', Validators.required],
      husbandsName:       [''],
      gender:             ['', Validators.required],
      maritalStatus:      ['', Validators.required],
      emailId:            ['', [Validators.required, Validators.email]],
      personalEmail:      [''],
      dateOfJoining:      ['', Validators.required],
      dateOfConfirmation: ['', Validators.required],
      personalNo:         ['', Validators.required],
      officeNo:           [''],
      emergencyContactNo: [''],
      department:         ['', Validators.required],
      designation:        ['', Validators.required],
      reportingTo:        ['Admin'],
      bonusPayTerm:       [''],
      city:               ['', Validators.required],
      workLocation:       [''],
      headquarters:       [''],
      employeeType:       [''],
      category:           [''],
      workState:          ['', Validators.required],
      replaceToWhom:      [''],
      biometricId:        [''],
      others1:            [''],
      others2:            [''],
      others3:            [''],
      others4:            [''],
      others5:            [''],
      nationality:        ['', Validators.required],
      weekOffMapping:     [''],
      shiftMapping:       [''],
      previousMemberId:   [''],
      isFresher:          [''],
      isPhysicalHandicap: [''],
      leaveLevel1:        [''],
      leaveLevel2:        [''],
      reimbLevel1:        [''],
      reimbLevel2:        [''],
      portalAccess:       [false],
      portalUserName:     [''],
      portalPassword:     [''],
      providentFund:      [false],
      pfAccountNumber:    [''],
      uanNumber:          [''],
      stateInsurance:     [false],
      tds:                [false],
      tdsRegime:          ['old'],
      professionalTax:    [false],
      lwf:                [false],
      higherWages:        [false]
    });

    this.step2Form = this.fb.group({
      bloodGroup:        [''],
      dateOfAnniversary: [''],
      dobDocument:       [''],
      dobActual:         [''],
      micr:              [''],
      field1:            [''],
      field2:            [''],
      field3:            [''],
      field5:            [''],
      cbm:               [''],
      field6:            [''],
      nothing:           [''],
      nothing123:        [''],
      section:           [''],
    });

    this.step3Form = this.fb.group({
      templateName:  [''],
      yearlyMonthly: [''],
      ctcYearly:     ['']
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onToggleChange(controlName: string): void {
    const isOn = this.step1Form.get(controlName)?.value;
    if (!isOn) {
      if (controlName === 'portalAccess') {
        this.step1Form.patchValue({ portalUserName: '', portalPassword: '' });
      } else if (controlName === 'providentFund') {
        this.step1Form.patchValue({ pfAccountNumber: '', uanNumber: '' });
      } else if (controlName === 'tds') {
        this.step1Form.patchValue({ tdsRegime: 'old' });
      }
    }
  }

  setRegime(regime: 'old' | 'new'): void {
    this.step1Form.patchValue({ tdsRegime: regime });
  }

  addFamilyRow(): void {
    this.familyRows.push({ name: '', relationship: '', mobileNumber: '', dob: '', aadhaar: '' });
  }

  removeFamilyRow(index: number): void {
    this.familyRows.splice(index, 1);
  }

  addExperience(): void {
    this.experienceList.push({ experienceYears: '', companyName: '', jobTitle: '', dateOfJoining: '', dateOfRelieving: '', location: '' });
  }

  removeExperience(index: number): void {
    this.experienceList.splice(index, 1);
  }

  addEducation(): void {
    this.educationList.push({ degree: '', branch: '', university: '', dateOfJoining: '', dateOfCompletion: '', location: '' });
  }

  removeEducation(index: number): void {
    this.educationList.splice(index, 1);
  }

  onSubmit(): void {
    const payload = {
      ...this.step1Form.getRawValue(),
      ...this.step2Form.value,
      ...this.step3Form.value,
      familyDetails:     this.familyRows,
      experienceDetails: this.experienceList,
      educationDetails:  this.educationList
    };
    console.log('Employee data:', payload);
    this.router.navigate(['/employees/employee-directory']);
  }

  onUpdateLater(): void {
   // Persists progress so far without finalizing — wire this to your
   // draft/save-progress API endpoint when it's ready.
   const payload = {
     ...this.step1Form.getRawValue(),
     ...this.step2Form.value,
     ...this.step3Form.value,
     familyDetails:     this.familyRows,
     experienceDetails: this.experienceList,
     educationDetails:  this.educationList
   };
   console.log('Saved for later:', payload);
   this.router.navigate(['/employees/employee-directory']);
 }

  onCancel(): void {
    this.router.navigate(['/employees/employee-directory']);
  }
}