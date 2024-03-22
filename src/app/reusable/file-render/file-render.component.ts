import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-file-render',
  templateUrl: './file-render.component.html',
  styleUrls: ['./file-render.component.scss'],
})
export class FileRenderComponent {
  @Input() message: any;
  url: any;
  safeurl: any;
  FileContact: any;
  currentUser: any;
  constructor(
    private chatservice: ChatService,
    private sanitizer: DomSanitizer,
  ) {}
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res;
    });
    if (this.message.fileLink && this.message.type !== 'contact') {
      this.chatservice.getFile(this.message.fileLink).subscribe(
        (res: any) => {
          if (res) {
            const base64 = new Uint8Array(res.data.data);
            this.url = URL.createObjectURL(
              new Blob([base64], { type: res.type }),
            );
            this.safeurl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.url,
            );
          }
        },
        (error) => {
          console.error('Error loading image', error);
        },
      );
    } else {
      this.FileContact = JSON.parse(this.message.fileLink);
    }
  }
  getMessageType(data: string) {
    if (data.includes('pdf')) return 'application/pdf';
    else if (data.includes('jpeg')) return 'image/jpeg';
    else if (data.includes('png')) return 'image/png';
    else if (data.includes('sheet')) return 'xlsx';
    return data;
  }
  downloadFile(e: any, url: any, fileName: string) {
    e.stopPropagation();
    const el = document.createElement('a');
    el.href = url;
    el.target = '_blank';
    el.download = fileName;
    el.click();
    return url;
  }
  getMessageClass(message: any): string {
    return this.currentUser._id === message.from.id ? 'SendUser' : 'receive';
  }
}
