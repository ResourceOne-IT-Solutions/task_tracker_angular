import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketdescriptionComponent } from './ticket-description.component';

describe('ClientdescriptionComponent', () => {
  let component: TicketdescriptionComponent;
  let fixture: ComponentFixture<TicketdescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketdescriptionComponent],
    });
    fixture = TestBed.createComponent(TicketdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
