import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientdescriptionComponent } from './clientdescription.component';

describe('ClientdescriptionComponent', () => {
  let component: ClientdescriptionComponent;
  let fixture: ComponentFixture<ClientdescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientdescriptionComponent]
    });
    fixture = TestBed.createComponent(ClientdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
