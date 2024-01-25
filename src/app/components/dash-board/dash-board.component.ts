import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Chart, registerables } from 'node_modules/chart.js';
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent {
  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('userDetailsModel', { static: false }) userDetailsModel: any;
  @ViewChild('ticketModel', { static: false }) ticketModel: any;
  @ViewChild('assignTicketModel', { static: false }) assignTicketModel: any;
  @ViewChild('requestTicketmodal', { static: false }) requestTicketmodal: any;
  @ViewChild('sendMailModel', { static: false }) sendMailModel: any;

  isAdminStatus = false;

  phone: any;
  modelHeader: string = '';
  'userForm': FormGroup;
  'clientForm': FormGroup;
  'TicketCreationForm': FormGroup;
  genders: any = ['Male', 'Female', 'Not Specified'];
  userColumns: Array<Column> = [
    {
      columnDef: 'firstName',
      header: 'First Name',
      cell: (element: any) => `${element['firstName']}`,
      isText: true,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: any) => `${element['email']}`,
      isText: true,
    },
    {
      columnDef: 'mobile',
      header: 'Mobile',
      cell: (element: any) => `${element['mobile']}`,
      isText: true,
    },
    {
      columnDef: 'designation',
      header: 'Designation',
      cell: (element: any) => `${element['designation']}`,
      isText: true,
    },
    {
      columnDef: 'empId',
      header: 'Employee Id',
      cell: (element: any) => `${element['empId']}`,
      isText: true,
    },
    {
      columnDef: 'profileImageUrl',
      header: 'Profile Pic',
      cell: (element: any) => `${element['profileImageUrl']}`,
      isImage: true,
    },
    {
      columnDef: 'dob',
      header: 'Date of Birth',
      cell: (element: any) => `${new Date(element['dob']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'action',
      header: 'Action',
      cell: (element: any) => (element === 'btn1' ? 'Edit' : 'Delete'),
      isMultiButton: true,
    },
  ];
  clientColumns: Array<Column> = [
    {
      columnDef: 'firstName',
      header: 'Client Name',
      cell: (element: any) => `${element['firstName']}`,
      isText: true,
    },
    {
      columnDef: 'mobile',
      header: 'Mobile',
      cell: (element: any) => `${element['mobile']}`,
      isText: true,
    },
    {
      columnDef: 'technology',
      header: 'Technology',
      cell: (element: any) => `${element['technology']}`,
      isText: true,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: any) => `${element['email']}`,
      isText: true,
    },
    {
      columnDef: 'location',
      header: 'Location',
      cell: (element: any) =>
        `${element['location'].area} - ${element['location'].zone}`,
      isText: true,
    },
    {
      columnDef: 'action',
      header: 'Action',
      cell: (element: any) => (element === 'btn1' ? 'Edit' : 'Delete'),
      isMultiButton: true,
    },
  ];
  ticketColumns: Array<Column> = [
    {
      columnDef: 'client',
      header: 'client name',
      cell: (element: any) => `${element['client'].name}`,
      isText: true,
    },
    {
      columnDef: 'status',
      header: 'status',
      cell: (element: any) => `${element['status']}`,
      isText: true,
    },
    {
      columnDef: 'closedDate',
      header: 'closed date',
      cell: (element: any) => `${element['closedDate']}`,
      isText: true,
    },
    {
      columnDef: 'comments',
      header: 'comments',
      cell: (element: any) => `${element['comments']}`,
      isText: true,
    },
    {
      columnDef: 'description',
      header: 'description',
      cell: (element: any) => `${element['description']}`,
      isText: true,
    },
    {
      columnDef: 'user',
      header: 'user name',
      cell: (element: any) => `${element['user'].name || '--'}`,
      isText: true,
    },
    {
      columnDef: 'technology',
      header: 'Technology',
      cell: (element: any) => `${element['technology']}`,
      isText: true,
    },
    {
      columnDef: 'receivedDate',
      header: 'received Date',
      cell: (element: any) =>
        `${new Date(element['receivedDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'assignedDate',
      header: 'assigned Date',
      cell: (element: any) =>
        `${new Date(element['assignedDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'addOnResource',
      header: 'Helped By',
      cell: (element: any) =>
        `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`,
      isText: true,
    },
    {
      columnDef: 'assignTicket',
      header: 'assign Ticket',
      cell: (element: any) =>
        element['user']?.name ? 'Add Resource' : 'Assign User',
      isButton: true,
    },
    {
      columnDef: 'Update',
      header: 'update',
      cell: (element: any) => 'Send Mail',
      isButton: true,
    },
  ];
  pieChartData: number[] = [];
  pieChartLabels: string[] = [
    'Resolved',
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
  userModelData: any;
  userDetails: any;
  adminDetails: any;
  clientDetails: any;
  ticketDetails: any;
  assignUser: any;
  AssignedUser: any = '';
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
  mailSuccessMsg: any;
  loadingStaus: boolean = false;
  constructor(
    private chatservice: ChatService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
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
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
      this.cities = [
        ...new Set(this.clientData.map((res: any) => res.location.area)),
      ].filter((val: any) => val !== undefined);
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

    this.user = localStorage.getItem('userData');
    this.chatservice.getAllUsers().subscribe((res) => {
      this.userList = res;
    });
  }

  openPopup(content: any): void {
    this.modalService.open(content);
  }

  /// admin status

  selectChange(data: any) {
  }

  // user functions

  openUserModel() {
    this.userForm.reset();
    this.addNewUser = true;
    this.modelHeader = 'Add New User';
    this.openPopup(this.userModel);
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

  editUser(userData: any) {
    this.addNewUser = false;
    this.modelHeader = 'Update User';
    this.openPopup(this.userModel);
    this.userForm.patchValue({
      fname: userData.firstName,
      lname: userData.lastName,
      email: userData.email,
      phone: userData.mobile,
      dob: new Date(userData.dob).toISOString().split('T')[0],
    });
    this.userDetails = userData;
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
  updateClient(dismiss: any) {
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
    const payload = {
      id: this.clientDetails._id,
      data: data,
    };
    this.chatservice.updateClient(payload).subscribe((res: any) => {
      this.clientData = this.clientData.map((element: any) =>
        element._id === res._id ? res : element,
      );
    });
  }
  editClient(clientDetails: any) {
    this.selectLocation = clientDetails.location.area ? null : undefined;
    this.modelHeader = 'Update Client';
    this.openPopup(this.clientModel);
    this.clientDetails = clientDetails;
    this.clientForm.patchValue({
      name: clientDetails.firstName,
      location: clientDetails.location.area,
      mobile: clientDetails.mobile,
      technologies: clientDetails.technology,
      email: clientDetails.email,
      companyName: clientDetails.companyName,
      applicationType: clientDetails.applicationType,
    });
  }

  openUserDetails(userDetails: any) {
    this.userModelData = userDetails;
    if (this.userModelData && this.userModelData?.email) {
      this.chatservice.UserLogin(userDetails);
      this.modalService.open(this.userDetailsModel);
    }
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

  assignTicket(ticket: any) {
    this.assignErr = '';
    this.ticketDetails = ticket;
    this.assignUser = ticket.user?.name ? 'Assign Resource' : 'Assign User';
    this.AssignedUser = '';
    this.modalService.open(this.assignTicketModel);
  }
  ticketAssign(dismiss: any) {
    if (this.assignUser == 'Assign User') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          user: {
            name:
              this.AssignedUser.firstName + ' ' + this.AssignedUser.lastName,
            id: this.AssignedUser._id,
          },
          status: 'Assigned',
        },
      };
      this.chatservice.updateTicket(payload).subscribe((res: any) => {
        this.ticketData = this.ticketData.map((element: any) =>
          element._id === res._id ? res : element,
        );
        const payload = {
          id: this.AssignedUser._id,
          sender: {
            id: this.adminDetails._id,
            name: this.adminDetails.firstName,
          },
        };
        this.chatservice.sendSocketData({ key: 'assignTicket', data: payload });
        dismiss();
      });
    } else if (this.assignUser == 'Assign Resource') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          addOnResource: {
            name:
              this.AssignedUser.firstName + ' ' + this.AssignedUser.lastName,
            id: this.AssignedUser._id,
          },
        },
      };
      this.chatservice.updateResuorce(payload).subscribe(
        (res: any) => {
          const data = {
            ticket: { name: res.client.name, id: res._id },
            user: { name: res.user.name, id: res.user.id },
            resource: {
              name:
                this.AssignedUser.firstName + ' ' + this.AssignedUser.lastName,
              id: this.AssignedUser._id,
            },
            sender: {
              name:
                this.adminDetails.firstName + ' ' + this.adminDetails.lastName,
              id: this.adminDetails._id,
            },
          };
          this.ticketData = this.ticketData.map((element: any) =>
            element._id === res._id ? res : element,
          );
          this.chatservice.sendSocketData({ key: 'addResource', data });
          dismiss();
        },
        (err: any) => {
          if (err) {
            this.assignErr = err.error;
          }
        },
      );
    }
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

  routeToClientTickets(data: any) {
    this.router.navigate(['/client-tickets']);
    this.chatservice.getTicketId(data);
  }

  adminMessage(dismiss: any) {

    this.chatservice.sendSocketData({
      key: 'adminMessage',
      data: {
        sender: {
          id: this.adminDetails._id,
          name: this.adminDetails.firstName,
        },
        content: this.requestticketForm.value.request,
        time: this.chatservice.getFormattedTime(),
        date: this.chatservice.getFormattedDate(new Date()),
      },
    });
    dismiss();
  }
  xlSheet(data: any) {
  }
  // this.chatservice.sendSocketData({key:'requestChat',data:{user:{name:this.currentUser.firstName,id:this.currentUser._id},opponent:{name:this.SelectedUserdata.firstName,id:this.SelectedUserdata._id}}})
  // this.chatservice.sendSocketData({key:'adminMessage',data:{sender:{id:this.adminDetails._id, name : this.adminDetails.firstName},content:{this.this.requestticketForm.value,}})

  //  this.chatservice.sendSocketData({key : '' , data :adminMessagePayload })
  singleButtonClick(data: any) {
    if (data.name == 'Send Mail') {
      this.openPopup(this.sendMailModel);
      this.ticketDetails = data.userDetails;
      this.description = `Task Update:\n${this.ticketDetails.client.name},\n\n${this.ticketDetails.description}\n\nRegards,\nSupport Team.`;
    } else {
      this.assignTicket(data.userDetails);
    }
  }
  SendMail(dismiss: any) {
    this.loadingStaus = true;

    const payload = {
      to: 'bhaskarpaleti70366@gmail.com',
      content: `<pre>${this.description}</pre>`,
    };
    this.chatservice.sendMail(payload).subscribe((res) => {
      this.loadingStaus = false;
      this.mailSuccessMsg = res;
    });
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
