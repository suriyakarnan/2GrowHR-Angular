import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrunAttendanceComponent } from './payrun-attendance.component';

describe('PayrunAttendanceComponent', () => {
  let component: PayrunAttendanceComponent;
  let fixture: ComponentFixture<PayrunAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrunAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrunAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
