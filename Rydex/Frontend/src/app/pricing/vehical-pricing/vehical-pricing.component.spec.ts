import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalPricingComponent } from './vehical-pricing.component';

describe('VehicalPricingComponent', () => {
  let component: VehicalPricingComponent;
  let fixture: ComponentFixture<VehicalPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicalPricingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicalPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
