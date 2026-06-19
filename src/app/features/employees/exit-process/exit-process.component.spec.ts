import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitProcessComponent } from './exit-process.component';

describe('ExitProcessComponent', () => {
  let component: ExitProcessComponent;
  let fixture: ComponentFixture<ExitProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
