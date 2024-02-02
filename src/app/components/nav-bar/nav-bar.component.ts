import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('ticketModel', { static: false }) ticketModel: any;
  adminStatus = ['Offline', 'Break', 'Available', 'On Ticket'];

  @Input() 'isAdmin': boolean;
  technology = ['React Saga', 'Angular', 'Python', 'Vue Js', 'JQuery'];
  statuschange: any;
  @Input() userDetails: any;
  @Input() Status: any;
  'roomCount': number;
  'clientForm' :FormGroup
  'TicketCreationForm' :FormGroup;
  clientData:any
  constructor(
    private router: Router,
    private chatservice: ChatService,
    private route :ActivatedRoute,
    private modalService: NgbModal,
    private fb : FormBuilder
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
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
    this.Status = this.userDetails.status;
    this.roomCount = Object.keys(this.userDetails.newMessages).length
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.roomCount = Object.keys(this.userDetails.newMessages).length
    });
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res;
    });
  }
  logout() {
    this.deleteCookie('token');

    const logoutpayload = {
      id: this.userDetails._id,
    };
    this.chatservice.UserLogin('')
    this.chatservice.sendSocketData({ key: 'logout', data: logoutpayload.id });
    this.router.navigate(['/']);
  }
  changeStatus(data: any) {
    this.statuschange = data;
    const updatePayload = {
      id: this.userDetails._id,
      status: this.Status,
    };
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  OpenChatBox() {
    this.router.navigate(['Chat-Box'],{ relativeTo: this.route });
  }
  ViewRequest() {
    this.router.navigate(['view-requestPage'],{relativeTo :this.route});
  }
  ViewTicket() {
    this.router.navigate(['tickets'] , {relativeTo :this.route});
  }
  user() {
    this.router.navigate(['user-view-request'],{relativeTo :this.route});
  }
  userTickets() {
    console.log('63:')
    this.chatservice.ticketRequests('');
    this.router.navigate(['tickets'] , {relativeTo :this.route});
  }
  gotDashBoard(){
    this.router.navigate(['dashboard'])
  }
  OpenTicketModel() {
    this.modalService.open(this.ticketModel);

  }
  openUserModel() {
  }
  openClientModel() {
    this.clientForm.reset();
    this.openPopup(this.clientModel);
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  newClient(dismiss: any) {
    dismiss();
    const data = {
      firstName: this.clientForm.value.name,
      email: this.clientForm.value.email,
      mobile: this.clientForm.value.mobile,
      location: this.clientForm.value.location,
      companyName: this.clientForm.value.companyName,
      technology: this.clientForm.value.technologies,
      applicationType: this.clientForm.value.applicationType,
    };
    this.chatservice
      .AddNewClient(data)
      .subscribe((res) => console.log(res, 'new client res'));
  }
  cancel(dismiss: any) {
    dismiss();
    this.clientForm.reset();
  }
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
}
