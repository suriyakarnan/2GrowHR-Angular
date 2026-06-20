import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
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

  constructor(private fb: FormBuilder, private router: Router) {
    this.step1Form = this.fb.group({

      // ── Basic Information ──────────────────────────────
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

      // ── Personal Details ───────────────────────────────
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

      // ── Leave & Reimbursement Levels ───────────────────
      leaveLevel1:        [''],
      leaveLevel2:        [''],
      reimbLevel1:        [''],
      reimbLevel2:        [''],

      // ── Enable Access toggles ──────────────────────────
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
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
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
      } else if (controlName === 'stateInsurance' ) {
        this.step1Form.patchValue({ stateInsurance : ''})
      } else if (controlName === 'lwf') {
        this.step1Form.patchValue({ lwf : ''})
      }
    }
  }

  setRegime(regime: 'old' | 'new'): void {
    this.step1Form.patchValue({ tdsRegime: regime });
  }

  onSubmit(): void {
    const payload = this.step1Form.getRawValue();
    console.log('Employee data:', payload);
    this.router.navigate(['/employees/employee-directory']);
  }

  onCancel(): void {
    this.router.navigate(['/employees/employee-directory']);
  }
}