import { Component, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {
  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('userDetailsModel', { static: false }) userDetailsModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('sendMailModel', { static: false }) sendMailModel: any;
  @ViewChild('assignTicketModel', { static: false }) assignTicketModel: any;

  userList: any = [];
  modelHeader: string = '';
  'userForm': FormGroup;
  'clientForm': FormGroup;
  userDetails: any;
  userModelData: any;
  addNewUser: boolean = false;
  displayClient: boolean = true;
  loadingStaus: boolean = false;
  selectLocation: any = null;
  searchFilter: any;
  clientData: any = [];
  ticketData: any = [];
  todaysTickets: any = [];

  genders: any = ['Male', 'Female', 'Not Specified'];
  MockUsers: any;
  cities: any;
  clientDetails: any;
  ticketDetails: any;
  description: any;
  assignErr: any;
  assignUser: any;
  adminDetails: any;
  mailSuccessMsg: any;
  AssignedUser: any = '';

  userColumns: Array<Column> = [
    {
      columnDef: 'firstName',
      header: 'User Name',
      cell: (element: any) => `${this.chatservice.getFullName(element)}`,
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
  params: any;
  MockticketData: any;
  MockClientData: any;
  constructor(public chatservice: ChatService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.params = this.route.snapshot.routeConfig?.path?.split('-').join(' ');
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
    this.chatservice.getAllUsers().subscribe((res) => {
      this.userList = res;
      this.MockUsers = this.userList
      console.log(this.userList, '384::::')
      this.chatservice.TotalUser.next(this.userList.length)
    });
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
      this.MockClientData = this.clientData;
      this.cities = [
        ...new Set(this.clientData.map((res: any) => res.location.area)),
      ].filter((val: any) => val !== undefined);
    });
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.adminDetails = res;
    });
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.adminDetails = res;
    });
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.ticketData = res;
      this.MockticketData = this.ticketData;
      this.todaysTickets = this.ticketData.filter(
        (val: any) =>
          new Date(val.receivedDate).toLocaleDateString() ===
          new Date().toLocaleDateString(),
      );
    });
  }
  goback() {
    this.location.back()
  }
  SearchUsers() {
    this.userList = this.MockUsers.filter((val: any) => val.firstName.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1);
    this.ticketData = this.MockticketData.filter((val: any) => val.client.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
    this.clientData = this.MockClientData.filter((val: any) => val.firstName.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1)
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
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  validateNumberLength(control: AbstractControl) {
    if (control.value && control.value.toString().length > 10) {
      return { maxLengthExceeded: true };
    }
    return null;
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
  UserPage(dismiss: any) {
    dismiss();
    this.router.navigate(['../user', this.userModelData._id], { relativeTo: this.route });
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
  routeToClientTickets(data: any) {
    this.router.navigate(['../client-tickets'], { relativeTo: this.route });
    this.chatservice.getTicketId(data);
  }
  //Tickets
  assignTicket(ticket: any) {
    this.assignErr = '';
    this.ticketDetails = ticket;
    this.assignUser = ticket.user?.name ? 'Assign Resource' : 'Assign User';
    this.AssignedUser = '';
    this.modalService.open(this.assignTicketModel);
  }
  singleButtonClick(data: any) {
    if (data.name == 'Send Mail') {
      this.openPopup(this.sendMailModel);
      this.ticketDetails = data.userDetails;
      this.description = this.ticketDetails.description;
    } else {
      this.assignTicket(data.userDetails);
    }
  }
  ticketAssign(dismiss: any) {
    if (this.assignUser == 'Assign User') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          user: {
            name:
              this.chatservice.getFullName(this.AssignedUser),
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
            name: this.chatservice.getFullName(this.adminDetails),
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
              this.chatservice.getFullName(this.AssignedUser),
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
                this.chatservice.getFullName(this.AssignedUser),
              id: this.AssignedUser._id,
            },
            sender: {
              name:
                this.chatservice.getFullName(this.adminDetails),
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

  SendMail(dismiss: any) {
    this.loadingStaus = true;
    const payload = {
      to: this.ticketDetails.client.email,
      content: this.description,
      client: this.chatservice.getFullName(this.ticketDetails.client)
    };
    this.chatservice.sendMail(payload).subscribe((res) => {
      this.loadingStaus = false;
      this.mailSuccessMsg = res;
    });
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
}
