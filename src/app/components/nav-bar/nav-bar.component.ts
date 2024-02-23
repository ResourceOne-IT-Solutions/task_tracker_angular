import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { openDialog } from 'src/app/chat-store/table.actions';
import { getChatRequests } from 'src/app/chat-store/table.selector';
import { DialogInfoComponent } from 'src/app/reusable/dialog-info/dialog-info.component';
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
  adminStatus = ['Offline', 'Break', 'Available', 'On Ticket', 'Sleep'];
  Breaks = ['BreakFast Break', 'Lunch Break'];

  @Input() 'isAdmin': boolean;
  @Input() userDetails: any;
  @Input() Status: any;
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
  LunchBreak: boolean = false;
  requestCount: any = [];
  constructor(
    private router: Router,
    public chatservice: ChatService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
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

    this.Status = this.userDetails.status;
    this.roomCount = Object.keys(this.userDetails.newMessages).length;
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.roomCount = Object.keys(this.userDetails.newMessages).length;
    });
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
    });
    this.chatservice.getSocketData('notifications').subscribe((res: any) => {
      if (res.id === this.userDetails._id) {
        if (this.userDetails.newMessages.hasOwnProperty(res.room)) {
          this.userDetails.newMessages[res.room]++;
        } else {
          this.userDetails.newMessages[res.room] = 1;
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
  logout() {
    this.deleteCookie('token');

    const logoutpayload = {
      id: this.userDetails._id,
    };
    this.chatservice.sendSocketData({ key: 'logout', data: logoutpayload.id });
    this.router.navigate(['/']);
  }
  changeStatus(data: any) {
    this.StartTimer = false;
    const updatePayload = {
      id: this.userDetails._id,
      status: this.Status === 'Break' ? this.BreakStatus : this.Status,
    };
    this.BreakStatus = this.Breaks[0];
    this.Status === 'Available'
      ? this.idle.startIdleMonitoring()
      : this.idle.stopIdleIdleMonitoring();
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
  }
  changeBreakeStatus(data: any) {
    const updatePayload = {
      id: this.userDetails._id,
      status: this.Status === 'Break' ? this.BreakStatus : this.Status,
    };
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
    if (
      this.BreakStatus === 'BreakFast Break' ||
      this.BreakStatus === 'Lunch Break'
    ) {
      this.StartTimer = true;
      this.textColor = false;
      this.LunchBreak = false;
      this.Seconds = 0;
      this.Minutes = 0;
      this.clickHandler();
    } else {
      clearInterval(this.timerId);
      this.StartTimer = false;
    }
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  OpenChatBox() {
    this.router.navigate(['Chat-Box'], { relativeTo: this.route });
  }
  ViewRequest() {
    this.router.navigate(['view-requestPage'], { relativeTo: this.route });
  }
  ViewTicket() {
    this.router.navigate(['tickets'], { relativeTo: this.route });
  }
  user() {
    this.router.navigate(['user-view-request'], { relativeTo: this.route });
  }
  userTickets() {
    this.router.navigate(['tickets'], { relativeTo: this.route });
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
  OpenTicketModel() {
    this.submitTicketForm = false;
    this.TicketCreationForm.controls['targetDate'].patchValue(
      this.formatDate(),
    );
    this.modalService.open(this.ticketModel);
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
  openClientModel() {
    this.submitted = false;
    this.openPopup(this.clientModel);
  }
  openPopup(content: any): void {
    this.modalService.open(content);
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
    this.clientForm.reset();
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
  clickHandler() {
    this.timerId = setInterval(() => {
      this.Seconds++;
      if (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds = 0;
      }
      if (this.Minutes >= 20) {
        this.textColor = true;
      }
      if (this.Minutes >= 30) {
        this.LunchBreak = true;
      }
    }, 1000);
  }
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
}
