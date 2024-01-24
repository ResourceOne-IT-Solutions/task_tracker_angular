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
  constructor(
    private chatservice: ChatService,
    private sanitizer: DomSanitizer,
  ) {}
  ngOnInit() {
    if (this.message.fileLink) {
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
    }
  }
  getMessageType(data: string) {
    if (data.includes('pdf')) return 'application/pdf';
    else if (data.includes('jpeg')) return 'image/jpeg';
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
}
