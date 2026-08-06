import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailPanelComponent } from './profile-detail-panel.component';

describe('ProfileDetailPanelComponent', () => {
  let component: ProfileDetailPanelComponent;
  let fixture: ComponentFixture<ProfileDetailPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
