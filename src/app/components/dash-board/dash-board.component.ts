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
    'Available',
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
  cstDate!: string;
  pstDate!: string;
  est!: string;
  tableData: any = [];
  ChartData: any;
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
  UserListchart: any;
  url: string = '';
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
    this.url = this.chatservice.BE_URL + '/profile-images';
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
      const TicketStatus = this.chatservice.getPieChartData(this.ticketData);
      const sortedTicket: number[] = this.pieChartLabels.map(
        (label) => TicketStatus[label] || 0,
      );
      console.log(sortedTicket);
      this.TotalTicketsPiechart = {
        colors: this.pieChartColors,
        labels: this.pieChartLabels,
        data: sortedTicket,
      };
    });

    this.chatservice.getPendingTickets().subscribe((res: any) => {
      this.tableData = res;
      const statusData = this.chatservice.getPieChartData(this.tableData);
      const todayTicStatus: number[] = this.pieChartLabels.map(
        (label) => statusData[label] || 0,
      );
      this.ChartData = {
        colors: this.pieChartColors,
        labels: this.pieChartLabels,
        data: todayTicStatus,
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
      const users = this.UserListData.filter((val) => !val.isAdmin);
      console.log(users);
      this.UserListlength = users.length;
      const statusData = this.chatservice.getPieChartData(users);
      const sortedValues: number[] = this.UserpieChartLabels.map(
        (label) => statusData[label] || 0,
      );
      // const data = [...];
      this.UserListchart = {
        colors: this.UserpieChartColors,
        labels: this.UserpieChartLabels,
        data: sortedValues,
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
