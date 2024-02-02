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
  FormGroup,
  Validators,
} from '@angular/forms';
import { Chart, ChartType, registerables } from 'node_modules/chart.js';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent {
  @ViewChild('ticketModel', { static: false }) ticketModel: any;
  @ViewChild('requestTicketmodal', { static: false }) requestTicketmodal: any;
  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;

  isAdminStatus = false;

  phone: any;
  modelHeader: string = '';
  'userForm': FormGroup;
  'clientForm': FormGroup;
  'TicketCreationForm': FormGroup;
  pieChartData: number[] = [];
  pieChartLabels: string[] = [
    'Resolved',
    'Assigned',
    'Pending',
    'In Progress',
    'Not Assigned',
    'Improper Requirment',
  ];
  UserpieChartLabels: string[] = [
    'Avalible',
    'Offline',
    'Break',
    'On Ticket',
  ]

  pieChartColors: string[] = [
    'blue',
    'gray',
    'yellow',
    'green',
    'red',
    'purple',
  ];
  UserpieChartColors: string[] = [
    'green',
    'orange',
    'red',
    'blue'
  ];
  cities: any;
  technology = ['React Saga', 'Angular', 'Python', 'Vue Js', 'JQuery'];
  user: any;
  dropdownSettings: any;
  technologies: any = [];
  userList: any = [];
  clientData: any = [];
  ticketData: any = [];
  displayUsers: boolean = true;
  displayClient: boolean = false;
  displayTickets: boolean = false;
  userDetails: any;
  adminDetails: any;
  clientDetails: any;
  ticketDetails: any;
  assignUser: any;
  todaysTickets: any = [];
  resolvedTickets: any = [];
  pendingTickets: any = [];
  inprogressTickets: any = [];
  statuschange: any;
  selectLocation: any = null;
  selectGender: any = null;
  requestticketForm: any;
  assignErr: any;
  addNewUser: boolean = false;
  description: any;
  loadingStaus: boolean = false;
  Avalible: any = [];
  Offline: any = [];
  Break: any = [];
  OnTicket: any = [];
  UserListData: any;
  genders: any = ['Male', 'Female', 'Not Specified'];
  private chat!: Chart<'pie', any[], string>;

  constructor(
    public chatservice: ChatService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route:ActivatedRoute
  ) {
    this.TicketCreationForm = this.fb.group({
      client: ['', Validators.required],
      technologies: ['', Validators.required],
      targetDate: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.requestticketForm = this.fb.group({
      request: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.adminDetails = res;
    });
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
      profileImageUrl: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      isAdmin: [false],
    });
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      mobile: ['', [Validators.required, this.validateNumberLength.bind(this)]],
      technologies: ['', Validators.required],
      email: ['', Validators.required],
      applicationType: ['', Validators.required],
      companyName: ['', Validators.required],
    });
    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
      alert(message);
    });
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.adminDetails = res;
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      const message = `${res.sender.name} is Requisting for ${res.client.name} Tickets`;
      alert(message);
    });
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.ticketData = res;
      this.todaysTickets = this.ticketData.filter(
        (val: any) =>
          new Date(val.receivedDate).toLocaleDateString() ===
          new Date().toLocaleDateString(),
      );
      this.resolvedTickets = this.ticketData.filter(
        (val: any) => val.status.toLowerCase() == 'resolved',
      ).length;
      this.pendingTickets = this.ticketData.filter(
        (val: any) => val.status.toLowerCase() == 'pending',
      ).length;
      this.inprogressTickets = this.ticketData.filter(
        (val: any) =>
          val.status.toLowerCase() == 'in progress' ||
          val.status.toLowerCase() == 'in progess',
      ).length;
      const assigned = this.ticketData.filter(
        (val: any) => val.status.toLowerCase() == 'assigned',
      ).length;
      const improper = this.ticketData.filter(
        (val: any) => val.status.toLowerCase() == 'Improper Requirment',
      ).length;
      const notAssigned = this.ticketData.filter(
        (val: any) => val.status.toLowerCase() == 'not assigned',
      ).length;
      this.pieChart(
        this.resolvedTickets,
        assigned,
        this.pendingTickets,
        this.inprogressTickets,
        notAssigned,
        improper,
      );
    });
    this.technologies = [
      { id: 1, technology: 'Angular' },
      { id: 2, technology: 'React Js' },
      { id: 3, technology: 'Vue Js' },
      { id: 4, technology: 'Python' },
      { id: 5, technology: 'Jquery' },
    ];
    this.dropdownSettings = {
      idField: 'id',
      textField: 'technology',
    };
    this.chatservice.sendSocketData({
      data: { userId: this.adminDetails._id },
      key: 'newUser',
    });
    this.chatservice
      .getSocketData('newUser').subscribe(({ userPayload }) => {
        this.UserListData = userPayload,
          this.Avalible = this.UserListData.filter(
            (val: any) => val.status == 'Available',
          ).length,
          (this.Offline = this.UserListData.filter(
            (val: any) => val.status == 'Offline',
          ).length),
          (this.Break = this.UserListData.filter(
            (val: any) => val.status == 'Break',
          ).length),
          (this.OnTicket = this.UserListData.filter(
            (val: any) => val.status == 'On Ticket',
          ).length),
          this.UserpieChart(this.Avalible, this.Offline, this.Break, this.OnTicket)
      })
  }

  ngAfterViewInit() {
    this.UserpieChart(0, 0, 0, 0);
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

  selectChange(data: any) { }

  // user functions

  openUserModel() {
    this.userForm?.reset();
    this.addNewUser = true;
    this.modelHeader = 'Add New User';
    this.openPopup(this.userModel);
  }
  // client functions

  openClientModel() {
    this.modelHeader = 'Add New Client';
    this.selectLocation = null;
    this.clientForm.reset();
    this.openPopup(this.clientModel);
  }
  sendMessageToAll() {
    this.modelHeader = 'request ';
    this.openPopup(this.requestTicketmodal);
  }
  addUser(dismiss: any): void {
    const Data = {
      firstName: this.userForm.value.fname,
      lastName: this.userForm.value.lname,
      email: this.userForm.value.email,
      mobile: this.userForm.value.phone,
      password: `${this.userForm.value.fname}@123`,
      joinedDate: this.userForm.value.joiningDate,
      dob: this.userForm.value.dob,
      isAdmin: this.userForm.value.isAdmin !== null,
      gender: this.userForm.value.gender,
      designation: 'angular',
      profileImageUrl: this.userForm.value.profileImageUrl,
    };
    this.chatservice.AddNewUsers(Data).subscribe((res) => console.log(res));
    dismiss();
    this.userForm.reset();
  }
  newClient(dismiss: any) {
    dismiss();
    const data = {
      firstName: this.clientForm.value.name,
      email: this.clientForm.value.email,
      mobile: this.clientForm.value.mobile,
      location: { area: this.clientForm.value.location, zone: 'EST' },
      companyName: this.clientForm.value.companyName,
      technology: this.clientForm.value.technologies,
      applicationType: this.clientForm.value.applicationType,
    };
    this.chatservice
      .AddNewClient(data)
      .subscribe((res) => console.log(res, 'new client res'));
  }
  updateUser(dismiss: any): void {
    const Data = {
      firstName: this.userForm.value.fname,
      lastName: this.userForm.value.lname,
      email: this.userForm.value.email,
      mobile: this.userForm.value.phone,
      designation: this.userDetails.designation,
    };
    const payload = {
      id: this.userDetails._id,
      data: Data,
    };
    this.chatservice.UpdateUsers(payload).subscribe((res: any) => {
      this.userList = this.userList.map((element: any) =>
        element._id === res._id ? res : element,
      );
    });
    dismiss();
    this.userForm.reset();
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

  // ticket functions
  createTicket(dismiss: any) {
    if (this.TicketCreationForm.valid) {
      const payload = {
        client: {
          name: this.TicketCreationForm.value.client.firstName,
          id: this.TicketCreationForm.value.client._id,
          mobile: this.TicketCreationForm.value.client.mobile,
          email: this.TicketCreationForm.value.client.email,
        },
        user: {
          name: '',
          id: '',
        },
        technology: this.TicketCreationForm.value.technologies,
        description: this.TicketCreationForm.value.description,
        targetDate: this.TicketCreationForm.value.targetDate,
      };
      this.chatservice
        .createNewTicket(payload)
        .subscribe((res: any) => console.log(res, 'created ticket'));
    }
    this.TicketCreationForm.reset();
    dismiss();
  }

  OpenTicketModel() {
    this.modalService.open(this.ticketModel);
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
    this.chatservice.sendSocketData({
      key: 'adminMessage',
      data: {
        sender: {
          id: this.adminDetails._id,
          name: this.chatservice.getFullName(this.adminDetails),
        },
        content: this.requestticketForm.value.request,
        time: this.chatservice.getFormattedTime(),
        date: this.chatservice.getFormattedDate(new Date()),
      },
    });
    dismiss();
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
}
