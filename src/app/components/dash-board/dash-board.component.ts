import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../interface/users';
import { Chart, ChartType, registerables } from 'node_modules/chart.js';
import { Task } from 'src/app/interface/tickets';
import { Store, select } from '@ngrx/store';
import { loadUserData } from 'src/app/chat-store/table.actions';
import { TooltipPosition } from '@angular/material/tooltip';
import { getTableData } from 'src/app/chat-store/table.selector';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent {
  @ViewChild('requestTicketmodal', { static: false }) requestTicketmodal: any;

  isAdminStatus = false;
  modelHeader: string = '';
  userForm!: FormGroup;
  clientForm!: FormGroup;
  TicketCreationForm!: FormGroup;
  pieChartLabels: string[] = [
    'Closed',
    'Assigned',
    'Pending',
    'In Progress',
    'Not Assigned',
    'Improper Requirment',
  ];
  pieChartColors: string[] = [
    'blue',
    'gray',
    'yellow',
    'green',
    'red',
    'purple',
  ];
  UserpieChartLabels: string[] = [
    'Avalible',
    'Offline',
    'Break',
    'On Ticket',
    'Sleep',
  ];
  UserpieChartColors: string[] = ['green', 'orange', 'red', 'blue', 'purple'];
  dropdownSettings: any;
  ticketData: Task[] = [];
  adminDetails!: User | undefined;
  todaysTickets: Task[] = [];
  requestticketForm: string = '';
  loadingStaus: boolean = false;
  UserListData!: User[];
  private chat!: Chart<'pie', any[], string>;
  cstDate!: string;
  pstDate!: string;
  est!: string;
  tableData: any = [];
  ChartData: any = [];
  //ToolTip.
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = new FormControl(this.positionOptions[0]);
  TotalTicketsPiechart: any = [];
  UserListchart: any = [];
  UserListlength: any;
  constructor(
    public chatservice: ChatService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
  ) {}
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: User | undefined) => {
      this.adminDetails = res;
    });
    this.chatservice.getSocketData('statusUpdate').subscribe((res: User) => {
      this.adminDetails = res;
    });
    this.chatservice.getAllTickets().subscribe((res: Task[]) => {
      this.ticketData = res;
      this.todaysTickets = this.ticketData.filter(
        (val: Task) =>
          new Date(val.receivedDate).toLocaleDateString() ===
          new Date().toLocaleDateString(),
      );
      const resolvedTickets = this.chatservice.getTicketStatus(
        this.ticketData,
        'resolved',
      );
      const pendingTickets = this.chatservice.getTicketStatus(
        this.ticketData,
        'pending',
      );
      const inprogressTickets = this.chatservice.getTicketStatus(
        this.ticketData,
        'in progress',
      );
      const assigned = this.chatservice.getTicketStatus(
        this.ticketData,
        'assigned',
      );
      const improper = this.chatservice.getTicketStatus(
        this.ticketData,
        'improper requirment',
      );
      const notAssigned = this.chatservice.getTicketStatus(
        this.ticketData,
        'not assigned',
      );
      const Closed = this.chatservice.getTicketStatus(
        this.ticketData,
        'closed',
      );
      const data = [
        resolvedTickets,
        assigned,
        pendingTickets,
        inprogressTickets,
        notAssigned,
        improper,
        Closed,
      ];
      this.TotalTicketsPiechart = {
        colors: this.pieChartColors,
        labels: this.pieChartLabels,
        data: data,
      };
    });

    this.chatservice.getPendingTickets().subscribe((res: any) => {
      this.tableData = res;
      const resolvedTickets = this.chatservice.getTicketStatus(
        this.tableData,
        'resolved',
      );
      const pendingTickets = this.chatservice.getTicketStatus(
        this.tableData,
        'pending',
      );
      const inprogressTickets = this.chatservice.getTicketStatus(
        this.tableData,
        'in progress',
      );
      const assigned = this.chatservice.getTicketStatus(
        this.tableData,
        'assigned',
      );
      const improper = this.chatservice.getTicketStatus(
        this.tableData,
        'improper requirment',
      );
      const notAssigned = this.chatservice.getTicketStatus(
        this.tableData,
        'not assigned',
      );
      const data = [
        resolvedTickets,
        assigned,
        pendingTickets,
        inprogressTickets,
        notAssigned,
        improper,
      ];
      this.ChartData = {
        colors: this.pieChartColors,
        labels: this.pieChartLabels,
        data: data,
      };
    });

    this.dropdownSettings = {
      idField: 'id',
      textField: 'technology',
    };
    this.chatservice.sendSocketData({
      data: { userId: this.adminDetails?._id },
      key: 'newUser',
    });
    this.chatservice.getSocketData('newUser').subscribe(({ userPayload }) => {
      this.store.dispatch(loadUserData({ userList: userPayload }));
      this.UserListData = userPayload;
      this.UserListlength = this.UserListData.length;
      const Avalible = this.chatservice.getUserByStatus(
        this.UserListData,
        'available',
      );
      const Offline = this.chatservice.getUserByStatus(
        this.UserListData,
        'offline',
      );
      const Break = this.chatservice.getUserByStatus(
        this.UserListData,
        'break',
      );
      const OnTicket = this.chatservice.getUserByStatus(
        this.UserListData,
        'on ticket',
      );
      const Sleep = this.chatservice.getUserByStatus(
        this.UserListData,
        'sleep',
      );
      const data = [Avalible, Offline, Break, OnTicket, Sleep];
      this.UserListchart = {
        colors: this.UserpieChartColors,
        labels: this.UserpieChartLabels,
        data: data,
      };
    });

    setInterval(() => {
      let Estdate = new Date();
      this.est = Estdate.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
      });
      var myDate = new Date();
      this.pstDate = myDate.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
      });
      var myDate = new Date();
      this.cstDate = myDate.toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
      });
    }, 1000);
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  // client functions
  sendMessageToAll() {
    this.modelHeader = 'request ';
    this.openPopup(this.requestTicketmodal);
  }
  cancel(dismiss: any) {
    dismiss();
    this.userForm.reset();
    this.clientForm.reset();
    this.clientForm.controls['location'].patchValue('');
  }
  adminCancel(dismiss: any) {
    dismiss();
  }

  UserPage(dismiss: any) {
    dismiss();
    this.router.navigate(['/User-page']);
  }

  validateNumberLength(control: AbstractControl) {
    if (control.value && control.value.toString().length > 10) {
      return { maxLengthExceeded: true };
    }
    return null;
  }

  adminMessage(dismiss: any) {
    if (this.adminDetails) {
      this.chatservice.sendSocketData({
        key: 'adminMessage',
        data: {
          sender: {
            id: this.adminDetails._id,
            name: this.chatservice.getFullName(this.adminDetails),
          },
          content: this.requestticketForm,
          time: this.chatservice.getFormattedTime(),
          date: this.chatservice.getFormattedDate(new Date()),
        },
      });
      dismiss();
    }
  }
}

export interface Column {
  isTemplate?: boolean;
  columnDef: string;
  header: string;
  cell: Function;
  click?: Function;
  isMultiButton?: boolean;
  isButton?: boolean;
  isImage?: boolean;
  isText?: boolean;
  isLink?: boolean;
  isMouseOver?: boolean;
  isDetails?: boolean;
  isfeedBackImg?: boolean;
}
