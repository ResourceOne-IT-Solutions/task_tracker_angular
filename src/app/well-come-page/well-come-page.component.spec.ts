import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellComePageComponent } from './well-come-page.component';

describe('WellComePageComponent', () => {
  let component: WellComePageComponent;
  let fixture: ComponentFixture<WellComePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WellComePageComponent]
    });
    fixture = TestBed.createComponent(WellComePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
