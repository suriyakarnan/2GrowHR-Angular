import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignedDeactivatedListComponent } from './resigned-deactivated-list.component';

describe('ResignedDeactivatedListComponent', () => {
  let component: ResignedDeactivatedListComponent;
  let fixture: ComponentFixture<ResignedDeactivatedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResignedDeactivatedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignedDeactivatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
