import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallActivityComponent } from './wall-activity.component';

describe('WallActivityComponent', () => {
  let component: WallActivityComponent;
  let fixture: ComponentFixture<WallActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
