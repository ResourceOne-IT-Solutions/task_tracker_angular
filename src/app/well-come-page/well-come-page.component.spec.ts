import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellComePageComponent } from './well-come-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../services/chat.service';

fdescribe('WellComePageComponent', () => {
  let component: WellComePageComponent;
  let fixture: ComponentFixture<WellComePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WellComePageComponent],
      imports: [HttpClientModule],
      providers:[ChatService]
    });
    fixture = TestBed.createComponent(WellComePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
