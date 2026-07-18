import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycountAttendanceSummaryComponent } from './daycount-attendance-summary.component';

describe('DaycountAttendanceSummaryComponent', () => {
  let component: DaycountAttendanceSummaryComponent;
  let fixture: ComponentFixture<DaycountAttendanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaycountAttendanceSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycountAttendanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
