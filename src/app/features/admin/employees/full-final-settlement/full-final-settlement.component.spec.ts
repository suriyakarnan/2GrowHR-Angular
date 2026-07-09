import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFinalSettlementComponent } from './full-final-settlement.component';

describe('FullFinalSettlementComponent', () => {
  let component: FullFinalSettlementComponent;
  let fixture: ComponentFixture<FullFinalSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullFinalSettlementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullFinalSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
