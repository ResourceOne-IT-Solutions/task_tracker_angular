import { Component, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from 'src/app/reusable/dialog-model/dialog-model.component';

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
  addResourceData: any = []
  genders: any = ['Male', 'Female', 'Not Specified'];
  MockUsers: any;
  zones: any = ['EST', 'IST', 'CST', 'PST']
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
      cell: (element: any) => element['receivedDate'] ? `${new Date(element['receivedDate']).toLocaleString()}` : '',
      isText: true,
    },
    {
      columnDef: 'assignedDate',
      header: 'assigned Date',
      cell: (element: any) => element['assignedDate'] ? `${new Date(element['assignedDate']).toLocaleString()}` : '',
      isText: true,
    },
    {
      columnDef: 'description',
      header: 'description',
      cell: (element: any) => `${element['description']}`,
      isText: true,
    },
    {
      columnDef: 'comments',
      header: 'comments',
      cell: (element: any) => `${element['comments']}`,
      isText: true,
    },
    {
      columnDef: 'closedDate',
      header: 'closed date',
      cell: (element: any) => element['closedDate'] ? `${new Date(element['closedDate']).toLocaleString()}` : '--',
      isText: true,
    },
    {
      columnDef: 'targetDate',
      header: 'Target Date',
      cell: (element: any) => element['targetDate'] ? `${new Date(element['targetDate']).toLocaleString()}` : '',
      isText: true,
    },

    {
      columnDef: 'status',
      header: 'status',
      cell: (element: any) => `${element['status']}`,
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
    {
      columnDef: 'Closed',
      header: 'Closed',
      cell: (element: any) => element.isClosed ? 'Closed' : 'Close',
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
    private route: ActivatedRoute,
    public dialog: MatDialog,

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
      address: ['', Validators.required],
    });
    this.clientForm = this.fb.group({
      location: ['', Validators.required],
      zone: ['', Validators.required],
      mobile: ['', [Validators.required, this.validateNumberLength.bind(this)]],
      technologies: ['', Validators.required],
      companyName: ['', Validators.required],
    });
    this.chatservice.getAllUsers().subscribe((res) => {
      this.userList = res;
      this.MockUsers = this.userList
      this.chatservice.TotalUser.next(this.userList.length)
    });
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
      this.MockClientData = this.clientData;
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
  // user form
  get user() { return this.userForm.controls }
  get fname() { return this.user['fname'] }
  get lname() { return this.user['lname'] }
  get email() { return this.user['email'] }
  get phone() { return this.user['phone'] }
  get dob() { return this.user['dob'] }
  get joiningDate() { return this.user['joiningDate'] }
  get profileImageUrl() { return this.user['profileImageUrl'] }
  get address() { return this.user['address'] }

  // client form
  get client() { return this.clientForm.controls }
  get clientLocation() { return this.client['location'] }
  get zone() { return this.client['zone'] }
  get technologies() { return this.client['technologies'] }
  get mobile() { return this.client['mobile'] }
  get companyName() { return this.client['companyName'] }

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

  updateClient(dismiss: any) {
    dismiss();
    const data = {
      mobile: this.clientForm.value.mobile,
      location: { area: this.clientForm.value.location, zone: this.clientForm.value.zone },
      companyName: this.clientForm.value.companyName,
      technology: this.clientForm.value.technologies,
    };
    const payload = {
      id: this.clientDetails._id,
      data: data,
    };
    console.log(payload, 'upadte client payload')
    this.chatservice.updateClient(payload).subscribe((res: any) => {
      this.clientData = this.clientData.map((element: any) =>
        element._id === res._id ? res : element,
      );
    });
  }
  editClient(clientDetails: any) {
    this.selectLocation = clientDetails.location.area ? null : undefined;
    this.openPopup(this.clientModel);
    this.clientDetails = clientDetails;
    this.clientForm.patchValue({
      name: clientDetails.firstName,
      location: clientDetails.location.area,
      zone: clientDetails.location.zone,
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
    console.log(ticket, "ticket")
    const userdata: any = this.MockUsers.filter((val: any) => !val.isAdmin && val._id !== ticket.user.id)
    this.addResourceData = userdata.filter((val: any) => !ticket.addOnResource.map((res: any) => res.id).includes(val._id))
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
    } else if (data.name == 'Assign User' || data.name == 'Add Resource') {
      this.assignTicket(data.userDetails);
    } else if (data.name === 'Close') {
      this.closeTicket(data.userDetails)
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
  closeTicket(data: any) {
    const dialogRef = this.dialog.open(DialogModelComponent, {
      data: { message :'Are Sure You Want To Close The Ticket ?' , btn1 : 'Yes' , btn2 : 'No' },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        const ticketpayload = {
          id: data._id,
          data: {
            isClosed: true
          },
        };
        this.chatservice.updateTicket(ticketpayload).subscribe((res: any) => {
          this.ticketData = this.ticketData.map((element: any) =>
            element._id === res._id ? res : element,
          );
        })
      }
    });
   
  }
  deleteUser(user: any) {
    const dialogRef = this.dialog.open(DialogModelComponent, {
      data: { message :'Are Sure You Want To Delete This User ?' , btn1 : 'Yes' , btn2 : 'No' },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.chatservice.delete(`/clients/${user._id}`).subscribe((res: any) => console.log(res, 'user Deleted'))
      }
    })
  }
  deleteClient(client: any) {
    const dialogRef = this.dialog.open(DialogModelComponent, {
      data: { message :'Are Sure You Want To Delete This Client ?' , btn1 : 'Yes' , btn2 : 'No' },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.chatservice.delete(`/clients/${client._id}`).subscribe((res: any) => console.log(res, 'Client Deleted'))
      }
    })
  }
  phoneValidation(evt: any) {
    console.log(this.phone?.value)
    const inputChar = String.fromCharCode(evt.charCode);
    if (this.phone?.value.length > 9 || !/^\d+$/.test(inputChar)) {
      evt.preventDefault()
      return
    }
  }
}
