import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-ticket-description',
  templateUrl: './ticket-description.component.html',
  styleUrls: ['./ticket-description.component.scss'],
})
export class TicketdescriptionComponent {
  @ViewChild('sendMailModel', { static: false }) sendMailModel: any;
  description: any;
  paramId: any;
  CurrentUser: any;
  loadingStaus: boolean = false;
  descriptionContect: any;
  SuccessMessage: any;
  constructor(
    private chatservice: ChatService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private location: Location,
  ) {}
  ngOnInit() {
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.chatservice.get(`/tickets/${this.paramId}`).subscribe((res: any) => {
      this.description = res;
    });
    this.chatservice.UserLoginData.subscribe((res) => {
      this.CurrentUser = res;
    });
    // this.UpdateContent()
  }
  getaddonResource() {
    const desc = this.description.addOnResource;
    if (desc) {
      return desc.map((val: any) => val.name).join(',');
    }
  }
  ClientUpdates() {
    const update = this.description.updates;
    if (update) {
      return update.map((val: any) => val);
    }
  }
  goback() {
    this.location.back();
  }
  ConvertToExcel() {
    const updateContent = (updates: any) => {
      let str = '';
      updates.forEach((update: any, i: any) => {
        const content = `Update ${i + 1}:,\nDate: ${new Date(
          update.date,
        ).toLocaleString()},\nDescription: ${update.description},\nComments: ${
          update.comments
        },\nStatus: ${update.status},\nUpdated by: ${update.updatedBy.name}`;
        str += content + '\n\n';
      });
      return str;
    };
    const modifiedElement = {
      'Consultant Name': this.description.client.name,
      'Owner Name:': this.description.user.name,
      'Created Date': this.description.receivedDate,
      'Final Status': this.description.status,
      Updates: updateContent(this.description.updates),
    };
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([modifiedElement]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'excel-export.xlsx');
  }
  SendMail() {
    this.openPopup(this.sendMailModel);
    this.descriptionContect = this.description;
  }
  UpdateContent(data: any) {
    let str = '';
    this.description?.updates.forEach((val: any, i: any) => {
      const content = `Update ${i + 1}:,\nDate:${new Date(val.date).toLocaleString()},\nDescription: ${val.description},\nComments: ${val.comments},\nStatus: ${val.status},\nUpdate by: ${val.updatedBy.name},`;
      str += content + '\n';
    });
    return str;
  }
  TicketsSendMail(dismiss: any) {
    this.loadingStaus = true;
    const payload = {
      to: this.CurrentUser.email,
      content: this.description,
      // client: this.chatservice.getFullName(this.ticketDetails.client)
    };
    this.chatservice.ticketsendmail(payload).subscribe(
      (res) => {
        this.SuccessMessage = res;
        this.loadingStaus = false;
        dismiss();
        this.loadingStaus = false;
      },
      (error) => {
        console.log(error, '90::::');
      },
    );
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  cancel(dismiss: any) {
    dismiss();
  }
}
