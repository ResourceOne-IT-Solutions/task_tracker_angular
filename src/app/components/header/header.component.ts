import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interface/users';
import { ChatService } from 'src/app/services/chat.service';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() 'isAdmin': boolean;
  @Input() userDetails: any;
  @Input() Status: any;
  SelectedStatus: any;
  StartTimer: boolean = false;
  textColor: boolean = false;
  Minutes = 0;
  Seconds = 0;
  ms = 0;
  timerId: any = Number;
  adminStatus = ['Offline', 'Available', 'On Ticket', 'Sleep'];
  Breaks = ['BreakFast Break', 'Lunch Break'];
  adminDetails: any;
  url: string = '';
  isProfile: boolean = false;
  isCollapsed: boolean = true;
  fileToUpload: any;
  imageUrl: any;
  @Output() HamburgerClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('ticketModel', { static: false }) ticketModel: any;
  fileUpload: any;
  isDashBoard: boolean=false;

  constructor(
    private router: Router,
    private idle: IdleTimeService,
    public chatservice: ChatService,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.Status = this.userDetails.status;
    this.chatservice.UserLogin(this.userDetails);
    this.chatservice.UserLoginData.subscribe((res: User | undefined) => {
      this.adminDetails = res;
    });
    this.url = this.chatservice.BE_URL + '/profile-images';
  }

  SelectStatus(data: any) {
    this.SelectedStatus = data;
    this.StartTimer = false;
    const updatePayload = {
      id: this.userDetails._id,
      status: data,
    };
    data === 'Available'
      ? this.idle.startIdleMonitoring()
      : this.idle.stopIdleIdleMonitoring();
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
    if (
      this.SelectedStatus === 'BreakFast Break' ||
      this.SelectedStatus === 'Lunch Break'
    ) {
      this.StartTimer = true;
      this.textColor = false;
      this.Seconds = 0;
      this.Minutes = 0;
      this.clickHandler();
    } else {
      clearInterval(this.timerId);
      this.StartTimer = false;
    }
  }
  SelectBreakTime(breakTime: any) {
    this.SelectedStatus = breakTime;
    const updatePayload = {
      id: this.userDetails._id,
      status: breakTime,
    };
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
  }
  // logout function
  logout() {
    this.deleteTokens();
    const logoutpayload = {
      id: this.userDetails._id,
    };
    this.chatservice.UserLogin(undefined);
    this.chatservice.sendSocketData({ key: 'logout', data: logoutpayload.id });
    this.router.navigate(['/']);
  }

  handleFileInput(event: any) {
    this.fileUpload = event.target.files[0];
    if (this.fileUpload) {
      this.fileToUpload = this.fileUpload;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    }
  }
  edit_ProfileImg() {
    this.modalService.open(this.ticketModel);
  }
  UploadImg(dismiss: any) {
    const formData = new FormData();
    formData.append('file', this.fileUpload);
    formData.append('id', this.adminDetails._id);
    this.chatservice.updateProfile(formData).subscribe((res: any) => {
      this.adminDetails.profileImageUrl = res.profileImageUrl;
      this.chatservice.UserLogin(this.adminDetails);
    });
    dismiss();
  }

  deleteTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  clickHandler() {
    this.timerId = setInterval(() => {
      this.Seconds++;
      if (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds = 0;
      }
      if (this.Minutes >= 20 || this.Minutes >= 30) {
        this.textColor = true;
      }
    }, 1000);
  }
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
  // profile Data
  profileData() {
    this.isProfile = !this.isProfile;
  }
  gotDashBoard() {
    this.isDashBoard = true;
    this.chatservice.ClickDashBoard(this.isDashBoard);
    this.router.navigate(['dashboard']);
  }
  memuClick() {
    this.isCollapsed = !this.isCollapsed;
    this.HamburgerClick.emit(this.isCollapsed);
  }
  closeModel() {
    this.isProfile = false;
  }
  cancel(dismiss: any) {
    dismiss();
  }
}
