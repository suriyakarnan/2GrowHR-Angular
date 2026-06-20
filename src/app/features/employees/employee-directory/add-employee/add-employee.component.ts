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

  basicForm: FormGroup;
  personalForm: FormGroup;
  salaryForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.basicForm = this.fb.group({
      employeeCode: [{ value: '', disabled: true }],
      division: ['', Validators.required],
      subDivision: [''],
      jobType: ['', Validators.required],
      salutation: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
      fathersName: ['', Validators.required],
      husbandsName: [''],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      personalEmail: [''],
      dateOfJoining: ['', Validators.required],
      dateOfConfirmation: ['', Validators.required],
      personalNo: ['', Validators.required]
    });

    this.personalForm = this.fb.group({});
    this.salaryForm = this.fb.group({});
  }

  get activeForm(): FormGroup {
    if (this.currentStep === 1) return this.basicForm;
    if (this.currentStep === 2) return this.personalForm;
    return this.salaryForm;
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

  onSubmit(): void {
    if (this.basicForm.valid) {
      console.log('Employee data:', this.basicForm.value);
      this.router.navigate(['/employees/employee-directory']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees/employee-directory']);
  }
}