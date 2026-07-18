import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedAttendanceSummaryComponent } from './detailed-attendance-summary.component';

describe('DetailedAttendanceSummaryComponent', () => {
  let component: DetailedAttendanceSummaryComponent;
  let fixture: ComponentFixture<DetailedAttendanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedAttendanceSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedAttendanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
