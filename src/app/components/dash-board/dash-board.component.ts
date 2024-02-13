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
import { Store } from '@ngrx/store';
import { loadUserData } from 'src/app/chat-store/table.actions';
import { TooltipPosition } from '@angular/material/tooltip';
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
  pieChartData: number[] = [];
  pieChartLabels: string[] = [
    'Closed',
    'Assigned',
    'Pending',
    'In Progress',
    'Not Assigned',
    'Improper Requirment',
  ];
  UserpieChartLabels: string[] = ['Avalible', 'Offline', 'Break', 'On Ticket'];

  pieChartColors: string[] = [
    'blue',
    'gray',
    'yellow',
    'green',
    'red',
    'purple',
  ];
  UserpieChartColors: string[] = ['green', 'orange', 'red', 'blue'];
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

    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
      alert(message);
    });
    this.chatservice.getSocketData('statusUpdate').subscribe((res: User) => {
      this.adminDetails = res;
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      const message = `${res.sender.name} is Requisting for ${res.client.name} Tickets`;
      alert(message);
    });
    this.chatservice.getAllTickets().subscribe((res: Task[]) => {
      this.ticketData = res;
      this.todaysTickets = this.ticketData.filter(
        (val: Task) =>
          new Date(val.receivedDate).toLocaleDateString() ===
          new Date().toLocaleDateString(),
      );
      const resolvedTickets = this.getTicketStatus('resolved');
      const pendingTickets = this.getTicketStatus('pending');
      const inprogressTickets = this.getTicketStatus('in progress');
      const assigned = this.getTicketStatus('assigned');
      const improper = this.getTicketStatus('improper requirment');
      const notAssigned = this.getTicketStatus('not assigned');
      this.pieChart(
        resolvedTickets,
        assigned,
        pendingTickets,
        inprogressTickets,
        notAssigned,
        improper,
      );
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
      const Avalible = this.getUserByStatus('available');
      const Offline = this.getUserByStatus('offline');
      const Break = this.getUserByStatus('break');
      const OnTicket = this.getUserByStatus('on ticket');
      this.UserpieChart(Avalible, Offline, Break, OnTicket);
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

  ngAfterViewInit() {
    this.UserpieChart(0, 0, 0, 0);
  }
  getUserByStatus(status: string) {
    return this.UserListData.filter(
      (val: User) => val.status.toLowerCase() == status,
    ).length;
  }
  getTicketStatus(status: string) {
    return this.ticketData.filter(
      (val: Task) => val.status.toLowerCase() === status,
    ).length;
  }
  UserpieChart(avalible: any, offline: any, breakk: any, Onticket: any) {
    this.destroyPieChart();
    const canvas: any = document.getElementById('Userpiechart');
    this.chat = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.UserpieChartLabels,
        datasets: [
          {
            data: [avalible, offline, breakk, Onticket],
            backgroundColor: this.UserpieChartColors,
          },
        ],
      },
    });
  }

  private destroyPieChart() {
    if (this.chat) {
      this.chat.destroy();
    }
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  /// admin status

  selectChange(data: any) {}

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

  // tickets piechart
  pieChart(
    resolved: any,
    assigned: any,
    pending: any,
    inprogress: any,
    notAssigned: any,
    improper: any,
  ) {
    this.pieChartData = [
      resolved,
      assigned,
      pending,
      inprogress,
      notAssigned,
      improper,
    ];
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.pieChartLabels,
        datasets: [
          {
            label: '',
            data: this.pieChartData,
            backgroundColor: this.pieChartColors,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
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
  columnDef: string;
  header: string;
  cell: Function;
  isMultiButton?: boolean;
  isButton?: boolean;
  isImage?: boolean;
  isText?: boolean;
  isLink?: boolean;
  isMouseOver?: boolean;
}
