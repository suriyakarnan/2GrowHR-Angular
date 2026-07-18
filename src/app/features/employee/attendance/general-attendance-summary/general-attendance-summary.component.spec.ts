import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAttendanceSummaryComponent } from './general-attendance-summary.component';

describe('GeneralAttendanceSummaryComponent', () => {
  let component: GeneralAttendanceSummaryComponent;
  let fixture: ComponentFixture<GeneralAttendanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralAttendanceSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralAttendanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
