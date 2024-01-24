import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelComePageComponent } from './welcome-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../../services/chat.service';

fdescribe('WellComePageComponent', () => {
  let component: WelComePageComponent;
  let fixture: ComponentFixture<WelComePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelComePageComponent],
      imports: [HttpClientModule],
      providers: [ChatService],
    });
    fixture = TestBed.createComponent(WelComePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
