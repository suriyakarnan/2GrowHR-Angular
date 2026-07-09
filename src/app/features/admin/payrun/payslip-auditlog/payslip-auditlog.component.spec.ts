import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipAuditlogComponent } from './payslip-auditlog.component';

describe('PayslipAuditlogComponent', () => {
  let component: PayslipAuditlogComponent;
  let fixture: ComponentFixture<PayslipAuditlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayslipAuditlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayslipAuditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
