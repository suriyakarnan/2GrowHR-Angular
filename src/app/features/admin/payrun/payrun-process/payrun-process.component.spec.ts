import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrunProcessComponent } from './payrun-process.component';

describe('PayrunProcessComponent', () => {
  let component: PayrunProcessComponent;
  let fixture: ComponentFixture<PayrunProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrunProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrunProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
