import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedPayslipComponent } from './processed-payslip.component';

describe('ProcessedPayslipComponent', () => {
  let component: ProcessedPayslipComponent;
  let fixture: ComponentFixture<ProcessedPayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessedPayslipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessedPayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
