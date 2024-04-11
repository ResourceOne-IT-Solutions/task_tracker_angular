import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { openDialog } from 'src/app/chat-store/table.actions';
import { getChatRequests } from 'src/app/chat-store/table.selector';
import { ChatService } from 'src/app/services/chat.service';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('ticketModel', { static: false }) ticketModel: any;
  adminStatus = ['Offline', 'Available', 'OnTicket', 'Sleep'];
  Breaks = ['BreakFastBreak', 'LunchBreak'];
  'isAdmin': boolean;
  userDetails: any;
  Status: any;
  'roomCount': number;
  'clientForm': FormGroup;
  'TicketCreationForm': FormGroup;
  clientData: any;
  submitted: boolean = false;
  submitTicketForm: boolean = false;
  userTicketsCount: any = [];
  userChatRequestCount: any = [];
  userTicketRequestCount: any = [];
  StartTimer: boolean = false;
  BreakStatus: any;
  zones: any = ['EST', 'IST', 'CST', 'PST'];
  Minutes = 0;
  Seconds = 0;
  ms = 0;
  timerId: any = Number;
  textColor: boolean = false;
  requestCount: any = [];
  SelectedStatus: any;
  public isCollapsed = false;
  url: string = '';
  UserNavSelectedData: any;
  activeButton: string = '';
  UserButtons = [
    'Chat Box',
    'View Request User',
    'Tickets',
    'Feed Back',
    'Check FeedBacks',
  ];
  AdminButtons = [
    'Chat Box',
    'Create Ticket',
    'Add User',
    'Add Client',
    'Tickets',
    'View Request',
    'Feed Back',
    'Check FeedBacks',
  ];
  dashBoardRes: any;
  constructor(
    private router: Router,
    public chatservice: ChatService,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private idle: IdleTimeService,
    private dialog: MatDialog,
    private store: Store,
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      zone: ['', Validators.required],
      mobile: ['', [Validators.required]],
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
  }
  ngOnInit() {
  //  console.log(this.modalService.open(this.ticketModel),'96::::::',this.ticketModel)
  // this.ticketModel.subscribe((res:any)=> console.log(res,'97777797'));
    this.chatservice.dashBoard.subscribe((res:any) =>this.dashBoardRes = res)
    this.url = this.chatservice.BE_URL + '/profile-images';
    this.store.select(getChatRequests).subscribe((res: any) => {
      this.requestCount = [...res];
    });
    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (type === 'TICKET') {
          this.userTicketRequestCount.push(result);
        }
      });
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.userDetails = res;
      this.isAdmin = res?.isAdmin;
      this.roomCount = Object.keys(this.userDetails.newMessages).length;
    });
    this.Status = this.userDetails.status;
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.roomCount = Object.keys(this.userDetails.newMessages).length;
    });
    this.chatservice.getSocketData('notifications').subscribe((res: any) => {
      if (res.id === this.userDetails._id) {
        if (this.userDetails.newMessages.hasOwnProperty(res.room)) {
          this.userDetails.newMessages[res.room]++;
        } else {
          this.userDetails.newMessages[res.room] = 0;
        }
        const message = `you got new ${res.type} from ${res.from.name}`;
        this.store.dispatch(openDialog({ message, title: 'New Message' }));
        this.roomCount = Object.keys(this.userDetails.newMessages).length;
        this.chatservice.UserLogin(this.userDetails);
      }
    });
  }
  // client form
  get client() {
    return this.clientForm.controls;
  }
  get fname() {
    return this.client['name'];
  }
  get location() {
    return this.client['location'];
  }
  get zone() {
    return this.client['zone'];
  }
  get email() {
    return this.client['email'];
  }
  get mobile() {
    return this.client['mobile'];
  }
  get technologies() {
    return this.client['technologies'];
  }
  get applicationType() {
    return this.client['applicationType'];
  }
  get companyName() {
    return this.client['companyName'];
  }

  // ticket creation form
  get ticketform() {
    return this.TicketCreationForm.controls;
  }
  get clientName() {
    return this.ticketform['client'];
  }
  get tickettech() {
    return this.ticketform['technologies'];
  }
  get targetDate() {
    return this.ticketform['targetDate'];
  }
  get description() {
    return this.ticketform['description'];
  }

  OpenChatBox() {
    this.router.navigate(['Chat-Box'], { relativeTo: this.route });
  }
  OpenTicketModel(modalTicket: any) {
    this.router.navigate(['dashboard']);
    this.UserNavSelectedData = modalTicket;
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
    });
    this.submitTicketForm = false;
    this.TicketCreationForm.controls['targetDate'].patchValue(
      this.formatDate(),
    );
    this.modalService.open(this.ticketModel);
  }
  openClientModel(ClientModal: any) {
    this.UserNavSelectedData = ClientModal;
    this.router.navigate(['dashboard']);
    this.submitted = false;
    this.openPopup(this.clientModel);
  }
  AdminNav(data: any) {
    this.dashBoardRes = false;
    switch (data) {
      case 'Chat Box':
        this.activeButton = 'Chat Box';
        return this.router.navigate(['Chat-Box'], { relativeTo: this.route })
      case 'Add User':
        this.activeButton = 'Add User';
        return this.router.navigate(['create-user'], {
          relativeTo: this.route,
        });
      case 'Create Ticket':
        this.activeButton = 'Create Ticket';
        return this.OpenTicketModel(data);
      case 'Add Client':
        this.activeButton = 'Add Client';
        return this.openClientModel(data);
      case 'Tickets':
        this.activeButton = 'Tickets';
        return this.router.navigate(['tickets'], { relativeTo: this.route });
      case 'View Request':
        this.activeButton = 'View Request';
        return this.router.navigate(['view-requestPage'], {
          relativeTo: this.route,
        });
      case 'Feed Back':
        this.activeButton = 'Feed Back';
        return this.router.navigate(['feed-back'], { relativeTo: this.route });
      case 'Check FeedBacks':
        this.activeButton = 'Check FeedBacks';
        return this.router.navigate(['feed-back-list'], {
          relativeTo: this.route,
        });
      default:
        return '';
    }
  }
  UserNavBtn(data: any) {
    this.dashBoardRes = false;
    switch (data) {
      case 'Chat Box':
        this.activeButton = 'Chat Box';
        return this.router.navigate(['Chat-Box'], { relativeTo: this.route })
      case 'View Request User':
        this.activeButton = 'View Request User';
        return this.router.navigate(['user-view-request'], {
          relativeTo: this.route,
        });
      case 'Tickets':
        this.activeButton = 'Tickets';
        return this.router.navigate(['tickets'], { relativeTo: this.route });
      case 'Feed Back':
        this.activeButton = 'Feed Back';
        return this.router.navigate(['feed-back'], { relativeTo: this.route });
      case 'Check FeedBacks':
        this.activeButton = 'Check FeedBacks';
        return this.router.navigate(['feed-back-list'], {
          relativeTo: this.route,
        });
      default:
        return '';
    }
  }
  gotDashBoard() {
    this.router.navigate(['dashboard']);
  }
  private formatDate() {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  SelectClient(data: any) {
    this.clientData.filter((val: any) => {
      if (
        val.firstName ===
        this.TicketCreationForm.controls?.['client'].value.firstName
      ) {
        this.TicketCreationForm.controls['technologies'].patchValue(
          val.technology,
        );
      }
    });
  }

  openPopup(content: any): void {
   const popup= this.modalService.open(content);
   console.log(popup,'295::::')
  }
  newClient(dismiss: any) {
    this.submitted = true;
    if (this.clientForm.valid) {
      dismiss();
      const data = {
        firstName: this.clientForm.value.name,
        email: this.clientForm.value.email,
        mobile: this.clientForm.value.mobile,
        location: {
          area: this.clientForm.value.location,
          zone: this.clientForm.value.zone,
        },
        companyName: this.clientForm.value.companyName,
        technology: this.clientForm.value.technologies,
        applicationType: this.clientForm.value.applicationType,
        createdBy: {
          name: this.chatservice.getFullName(this.userDetails),
          id: this.userDetails._id,
        },
      };
      this.chatservice.AddNewClient(data).subscribe(
        (res) => {
          this.submitted = false;
          this.store.dispatch(
            openDialog({
              message: 'New Client Created Successful',
              title: 'New Client',
            }),
          );
        },
        (err) => {
          this.store.dispatch(
            openDialog({ message: err.error.error, title: 'Api Error' }),
          );
        },
      );
    }
  }
  cancel(dismiss: any) {
    dismiss();
    console.log('336666')
    this.clientForm.reset();
   this.activeButton = '';
  }
  createTicket(dismiss: any) {
    this.submitTicketForm = true;
    if (this.TicketCreationForm.valid) {
      const payload = {
        client: {
          name: this.TicketCreationForm.value.client.firstName,
          id: this.TicketCreationForm.value.client._id,
          mobile: this.TicketCreationForm.value.client.mobile,
          email: this.TicketCreationForm.value.client.email,
          location: this.TicketCreationForm.value.client.location,
        },
        user: {
          name: '',
          id: '',
        },
        technology: this.TicketCreationForm.value.technologies,
        description: this.TicketCreationForm.value.description,
        targetDate: this.TicketCreationForm.value.targetDate,
        createdBy: {
          name: this.chatservice.getFullName(this.userDetails),
          id: this.userDetails._id,
        },
      };
      this.chatservice.createNewTicket(payload).subscribe(
        (res: any) => {
          this.store.dispatch(
            openDialog({
              message: 'Ticket Created Successful',
              title: 'Create Ticket',
            }),
          );
        },
        (err) => {
          this.store.dispatch(
            openDialog({ message: err.error.error, title: 'Api Error' }),
          );
        },
      );
      dismiss();
      this.submitTicketForm = false;
      this.TicketCreationForm.reset();
    }
  }
  phoneValidation(evt: any) {
    const inputChar = String.fromCharCode(evt.charCode);
    if (this.mobile?.value?.length > 9 || !/^\d+$/.test(inputChar)) {
      const inputChar = String.fromCharCode(evt.charCode);
      if (!/^\d+$/.test(inputChar)) {
        evt.preventDefault();
        return;
      }
    }
  }
}
