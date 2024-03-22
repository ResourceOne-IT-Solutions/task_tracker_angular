import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from 'src/app/reusable/dialog-model/dialog-model.component';
import {
  Tickets,
  adminTicketColumns,
  clientColumns,
  description,
  footerColumns,
  ticketColumns,
  userColumns,
  userTicketColumns,
} from './tabledata';
import { Store, select } from '@ngrx/store';
import {
  getTableConfig,
  updatedTableData,
} from 'src/app/chat-store/table.selector';
import { Observable } from 'rxjs';
import {
  closeTicket,
  loadDeleteApi,
  loadTable,
  loadUpdateTicketApi,
  loadUpdateUser,
  openDialog,
  raiseTicket,
} from 'src/app/chat-store/table.actions';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserlistComponent {
  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('userDetailsModel', { static: false }) userDetailsModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('sendMailModel', { static: false }) sendMailModel: any;
  @ViewChild('assignTicketModel', { static: false }) assignTicketModel: any;
  @ViewChild('updateModel', { static: false }) updateModel: any;
  @ViewChild('TicketRaisedModal', { static: false }) TicketRaisedModal: any;

  modelHeader: string = '';
  'userForm': FormGroup;
  'clientForm': FormGroup;
  'updateForm': FormGroup;
  TicketRaised: string = '';
  userstatus: string[] = [
    'In Progress',
    'Pending',
    'Closed',
    'Improper Requirment',
  ];
  userDetails: any;
  userModelData: any;
  loadingStaus: boolean = false;
  selectLocation: any = null;
  searchFilter: any;
  tableData: any = [];
  addResourceData: any = [];
  genders: any = ['Male', 'Female', 'Not Specified'];
  zones: any = ['EST', 'IST', 'CST', 'PST'];
  clientDetails: any;
  userDetailsdata: any;

  ticketDetails: any;
  description: any;
  assignErr: any;
  updateError: any;
  assignUser: any;
  adminDetails: any;
  mailSuccessMsg: any;
  AssignedUser: any = '';
  tableData$!: Observable<any>;
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
    'green',
    'red',
    'gray',
    'yellow',
    'purple',
  ];
  ChartData: any = [];
  params: any;
  userSubmitted: boolean = false;
  updateSubmitted: boolean = false;
  raiseSubmitted: boolean = false;
  clientSubmitted: boolean = false;
  clientErr: any;
  userErr: any;
  url: string = '';
  mockTableData: any = [];
  showForm: boolean = false;
  close: any;
  tableColumns: any;
  constructor(
    public chatservice: ChatService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit() {
    this.url = this.chatservice.BE_URL + '/profile-images';
    this.params = this.route.snapshot.routeConfig?.path?.split('-').join(' ');
    this.store.dispatch(loadTable({ params: this.params }));
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });
    this.clientForm = this.fb.group({
      location: ['', Validators.required],
      zone: ['', Validators.required],
      mobile: ['', [Validators.required]],
      technologies: ['', Validators.required],
      companyName: ['', Validators.required],
    });
    this.updateForm = this.fb.group({
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.adminDetails = res;
    });
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.adminDetails = res;
    });
    this.store.pipe(select(getTableConfig)).subscribe((res: any) => {
      if (res.data && res.columns) {
        this.tableColumns = res.columns;
        this.tableData = res.data;
        this.mockTableData = res.data;
      }
    });
    this.store.pipe(select(updatedTableData)).subscribe((res: any) => {
      if (Object.keys(res).length > 0) {
        this.userSubmitted = false;
        this.updateSubmitted = false;
        this.tableData = this.tableData.map((element: any) =>
          element._id === res._id ? res : element,
        );
        this.updateForm.reset();
        this.updateForm.patchValue({
          status: '',
        });
      }
    });
  }
  // user form
  get user() {
    return this.userForm.controls;
  }
  // client form
  get client() {
    return this.clientForm.controls;
  }

  // update form
  get updateModal() {
    return this.updateForm.controls;
  }

  openPopup(content: any): void {
    this.modalService.open(content);
  }
  goback() {
    this.location.back();
  }

  // search filter
  SearchUsers() {
    if (this.params.includes('tickets')) {
      this.tableData = this.mockTableData.filter(
        (val: any) =>
          val.client.name
            .toLowerCase()
            .indexOf(this.searchFilter.toLowerCase()) > -1,
      );
    } else {
      this.tableData = this.mockTableData.filter(
        (val: any) =>
          this.chatservice
            .getFullName(val)
            .toLowerCase()
            .indexOf(this.searchFilter.toLowerCase()) > -1,
      );
    }
  }

  // CODE MINIMIZATION

  firstBtnClick(evt: any) {
    switch (this.params) {
      case 'user list':
        return this.editUser(evt);
      case 'client list':
        return this.editClient(evt);
      case 'user tickets':
        return this.update(evt);
      default:
        return;
    }
  }
  secondBtnClick(evt: any, name: any) {
    switch (this.params) {
      case 'user list':
        return this.delete(evt, 'user');
      case 'client list':
        return this.delete(evt, 'client');
      case 'user tickets':
        return this.routeToTickets(evt);
      default:
        return;
    }
  }
  nameClick(evt: any) {
    switch (this.params) {
      case 'user list':
        return this.routeUserPage(evt);
      case 'client list':
        return this.routeToClientTickets(evt);
      default:
        return;
    }
  }

  // Edit User

  editUser(userData: any) {
    this.userSubmitted = false;
    this.openPopup(this.userModel);
    this.userForm.patchValue({
      fname: userData.firstName,
      lname: userData.lastName,
      email: userData.email,
      phone: userData.mobile,
    });
    this.userDetails = userData;
  }

  updateUser(dismiss: any): void {
    this.userSubmitted = true;
    if (this.userForm.valid) {
      this.store.dispatch(
        loadUpdateUser({
          formData: this.userForm.value,
          user: this.userDetails,
        }),
      );
      dismiss();
      this.userForm.reset();
    }
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

  // route to user page
  routeUserPage(details: any) {
    this.router.navigate(['../user', details._id], {
      relativeTo: this.route,
    });
  }

  // Edit Client
  updateClient(dismiss: any) {
    this.clientSubmitted = true;
    if (this.clientForm.valid) {
      const data = {
        mobile: this.clientForm.value.mobile,
        location: {
          area: this.clientForm.value.location,
          zone: this.clientForm.value.zone,
        },
        companyName: this.clientForm.value.companyName,
        technology: this.clientForm.value.technologies,
      };
      const payload = {
        id: this.clientDetails._id,
        data: data,
      };
      this.chatservice.updateClient(payload).subscribe((res: any) => {
        this.tableData = this.tableData.map((element: any) =>
          element._id === res._id ? res : element,
        );
        this.clientSubmitted = false;
        this.store.dispatch(
          openDialog({
            message: 'Client Update Successfully',
            title: 'Client Update',
          }),
        );
      });
      dismiss();
    }
  }
  editClient(clientDetails: any) {
    this.clientSubmitted = false;
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
    this.router.navigate([`../client-tickets/${data._id}`], {
      relativeTo: this.route,
    });
  }
  //Tickets
  assignTicket(ticket: any) {
    this.chatservice.getAllUsers().subscribe((userlist) => {
      const userdata: any = userlist.filter(
        (val: any) => !val.isAdmin && val._id !== ticket.user.id,
      );
      this.addResourceData = userdata.filter(
        (val: any) =>
          !ticket.addOnResource.map((res: any) => res.id).includes(val._id),
      );
      this.assignErr = '';
      this.ticketDetails = ticket;
      this.assignUser = ticket.user?.name ? 'Assign Resource' : 'Assign User';
      this.AssignedUser = '';
      this.modalService.open(this.assignTicketModel);
    });
  }

  ticketAssign(dismiss: any) {
    if (this.assignUser == 'Assign User') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          user: {
            name: this.chatservice.getFullName(this.AssignedUser),
            id: this.AssignedUser._id,
          },
          status: 'Assigned',
        },
      };
      this.chatservice.updateTicket(payload).subscribe(
        (res: any) => {
          this.tableData = this.tableData.map((element: any) =>
            element._id === res._id ? res : element,
          );
          const payload = {
            id: this.AssignedUser._id,
            sender: {
              id: this.adminDetails._id,
              name: this.chatservice.getFullName(this.adminDetails),
            },
          };
          this.chatservice.sendSocketData({
            key: 'assignTicket',
            data: payload,
          });

          this.store.dispatch(
            openDialog({
              message: 'User Assigned Successfully',
              title: 'User Assigned',
            }),
          );
          dismiss();
        },
        (err) => {
          this.store.dispatch(
            openDialog({ message: err.error.error, title: 'Api Error' }),
          );
        },
      );
    } else if (this.assignUser == 'Assign Resource') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          addOnResource: {
            name: this.chatservice.getFullName(this.AssignedUser),
            id: this.AssignedUser._id,
          },
        },
      };
      this.chatservice.updateResuorce(payload).subscribe(
        (res: any) => {
          this.assignErr = '';
          const data = {
            ticket: { name: res.client.name, id: res._id },
            user: { name: res.user.name, id: res.user.id },
            resource: {
              name: this.chatservice.getFullName(this.AssignedUser),
              id: this.AssignedUser._id,
            },
            sender: {
              name: this.chatservice.getFullName(this.adminDetails),
              id: this.adminDetails._id,
            },
          };
          this.tableData = this.tableData.map((element: any) =>
            element._id === res._id ? res : element,
          );
          this.chatservice.sendSocketData({ key: 'addResource', data });
          this.store.dispatch(
            openDialog({
              message: 'Resource Assigned Successfully',
              title: 'Resource Assigned',
            }),
          );
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

  // table single button click

  singleButtonClick(data: any) {
    if (data.name == 'Send Mail') {
      this.openPopup(this.sendMailModel);
      this.ticketDetails = data.userDetails;
      this.description = this.ticketDetails.description;
    } else if (data.name == 'Assign User' || data.name == 'Add Resource') {
      this.assignTicket(data.userDetails);
    } else if (data.name === 'Close' || data.name === 'ReOpen') {
      this.openPopup(this.updateModel);
      this.userDetailsdata = data.userDetails;
      this.updateFormPatch(this.userDetailsdata);

      this.close = true;
      this.showForm = false;
      this.modelHeader = data.name + ' Ticket';
    }
  }
  // patch value to update form
  updateFormPatch(userDetails: any) {
    const ticketstatus = userDetails.status;
    this.updateForm.patchValue({
      description: userDetails.description,
      comments: userDetails.comments,
      status: this.userstatus.includes(ticketstatus) ? ticketstatus : '',
    });
  }

  // user ticket update form
  update(userDetails: any) {
    this.close = false;
    this.showForm = true;
    this.modelHeader = 'Update Ticket';
    this.openPopup(this.updateModel);
    this.updateFormPatch(userDetails);
    this.userDetailsdata = userDetails;
  }
  updateUserTicket(dismiss: any) {
    this.updateSubmitted = true;
    if (this.updateForm.valid) {
      this.store.dispatch(
        loadUpdateTicketApi({
          formData: this.updateForm.value,
          userId: this.userDetailsdata._id,
          admindetails: this.adminDetails,
        }),
      );
      dismiss();
    }
  }
  ticketraise(data: any) {
    this.modelHeader = 'raise Ticket';
    this.openPopup(this.TicketRaisedModal);
  }
  raiseTicket(dismiss: any) {
    this.raiseSubmitted = !this.raiseSubmitted;
    if (this.TicketRaised.length > 0) {
      this.store.dispatch(
        raiseTicket({ user: this.adminDetails, content: this.TicketRaised }),
      );
      dismiss();
    }
    this.TicketRaised = '';
  }
  routeToTickets(data: any) {
    const CilentPayload = {
      client: {
        name: data.client.name,
        id: data.client.id,
      },
      sender: {
        name: this.chatservice.getFullName(this.adminDetails),
        id: this.adminDetails._id,
      },
    };
    this.chatservice.sendSocketData({
      key: 'requestTickets',
      data: CilentPayload,
    });
  }

  SendMail(dismiss: any) {
    this.loadingStaus = true;
    const payload = {
      to: this.ticketDetails.client.email,
      content: this.description,
      client: this.chatservice.getFullName(this.ticketDetails.client),
    };
    this.chatservice.sendMail(payload).subscribe((res) => {
      this.loadingStaus = false;
      this.mailSuccessMsg = res;
    });
  }

  // close ticket
  closeTicket(dismiss: any) {
    const isClosed = this.modelHeader.includes('Close');
    const ticketpayload = {
      id: this.userDetailsdata._id,
      data: {
        isClosed,
        ...(this.showForm ? { ...this.updateForm.value } : {}),
        updatedBy: {
          name: this.chatservice.getFullName(this.adminDetails),
          id: this.adminDetails._id,
        },
      },
    };
    this.chatservice.updateTicket(ticketpayload).subscribe(
      (res: any) => {
        this.tableData = this.tableData.map((element: any) =>
          element._id === res._id ? res : element,
        );
        this.store.dispatch(
          openDialog({
            message: 'Ticket Closed Successfully',
            title: 'Ticket Closed',
          }),
        );
        dismiss();
        this.updateForm.reset();
        this.updateForm.patchValue({
          status: '',
        });
      },
      (error) => {
        this.store.dispatch(
          openDialog({
            message: 'Internal Error Please Try Again After Some Time',
            title: 'Api Error',
          }),
        );
      },
    );
  }
  delete(data: any, user: any) {
    this.store.dispatch(loadDeleteApi({ data, name: user }));
  }
  phoneValidation(evt: any) {
    const inputChar = String.fromCharCode(evt.charCode);
    if (this.user['phone']?.value.length > 9 || !/^\d+$/.test(inputChar)) {
      evt.preventDefault();
      return;
    }
  }
  gotodescription(data: any) {
    this.router.navigate(['../ticket-description', data._id], {
      relativeTo: this.route,
    });
  }
}
