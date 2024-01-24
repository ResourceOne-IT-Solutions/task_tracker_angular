import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestPageComponent } from './view-request-page.component';

describe('ViewRequestPageComponent', () => {
  let component: ViewRequestPageComponent;
  let fixture: ComponentFixture<ViewRequestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRequestPageComponent],
    });
    fixture = TestBed.createComponent(ViewRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
