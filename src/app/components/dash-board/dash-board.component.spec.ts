import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { DashBoardComponent } from './dash-board.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interface/users';
import { of } from 'rxjs';

fdescribe('DashBoardComponent', () => {
  let component: DashBoardComponent;
  let fixture: ComponentFixture<DashBoardComponent>;
  let service: ChatService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashBoardComponent],
      imports: [
        HttpClientModule,
        StoreModule.forRoot(provideMockStore),
        RouterTestingModule,
      ],
      providers: [ChatService],
    });
    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
    // service = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    service = TestBed.inject(ChatService);
    // route = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set adminDetails on subscription', () => {
    const mockUser: User = {
      _id: 'test',
      firstName: 'Test Admin',
      createdBy: {
        name: '',
        id: '',
      },
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      dob: '',
      userId: '',
      status: '',
      empId: '',
      joinedDate: '',
      isAdmin: false,
      lastActive: '',
      isActive: false,
      designation: '',
      address: '',
      profileImageUrl: null,
      totalTickets: 0,
      helpedTickets: 0,
      resolvedTickets: 0,
      pendingTickets: 0,
      progressTickets: 0,
      assignedTickets: 0,
      groups: [],
      breakTime: [],
      gender: '',
      newMessages: 'test',
      loginTimings: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
    } as any;
    spyOn(service, 'getSocketData').and.returnValue(of(mockUser));
    component.ngOnInit();
    expect(component.adminDetails).toEqual(mockUser);
  });
});
