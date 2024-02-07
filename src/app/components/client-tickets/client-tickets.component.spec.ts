import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientTicketsComponent } from './client-tickets.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { TableComponent } from 'src/app/reusable/table/table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClientTicketsComponent', () => {
  let component: ClientTicketsComponent;
  let fixture: ComponentFixture<ClientTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientTicketsComponent, TableComponent],
      imports: [HttpClientModule, NgxSpinnerModule],
      providers: [ChatService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ClientTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
