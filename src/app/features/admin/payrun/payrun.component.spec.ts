import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrunComponent } from './payrun.component';

describe('PayrunComponent', () => {
  let component: PayrunComponent;
  let fixture: ComponentFixture<PayrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
