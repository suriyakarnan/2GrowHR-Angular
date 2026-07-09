import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsPortalComponent } from './hrms-portal.component';

describe('HrmsPortalComponent', () => {
  let component: HrmsPortalComponent;
  let fixture: ComponentFixture<HrmsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrmsPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrmsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
