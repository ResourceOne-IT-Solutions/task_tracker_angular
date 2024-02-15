import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss'],
})
export class FeedBackComponent {
  currentUser: any;
  IssueType = ['Bug', 'Feature', 'Update'];
  'feedBackForm': FormGroup;
  submitted: boolean = false;
  selectedFile: any;
  params: any;
  feedBackData: any;
  feedbackcolumns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: any) => `${this.chatservice.getFullName(element.sender)}`,
      isText: true,
    },
    {
      columnDef: 'type',
      header: 'Issue Type',
      cell: (element: any) => `${element['type']}`,
      isText: true,
    },
    {
      columnDef: 'content',
      header: 'Content',
      cell: (element: any) => `${element['content']}`,
      isText: true,
    },
    {
      columnDef: 'time',
      header: 'Update Time',
      cell: (element: any) =>
        `${new Date(element['time']).toLocaleDateString() + ' -- ' + new Date(element['time']).toLocaleTimeString()}`,
      isText: true,
    },
    {
      columnDef: 'file',
      header: 'Images',
      cell: (element: any) => `${element['file'] ? element['file'] : 'N/A'}`,
      isText: true,
    },
  ];
  constructor(
    public chatservice: ChatService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.feedBackForm = this.fb.group({
      content: ['', Validators.required],
      SelectIssue: ['', Validators.required],
      file: [''],
    });
  }
  ngOnInit() {
    this.params = this.route.snapshot.routeConfig?.path;
    this.chatservice.UserLoginData.subscribe((res) => {
      this.currentUser = res;
    });
    this.chatservice.getFeedBack().subscribe((res: any) => {
      this.feedBackData = res;
      console.log(res, '35:::::');
    });
  }
  SelectedImage(evt: any) {
    this.selectedFile = evt.target.files[0];
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  }
  SubmitFeedBack() {
    this.submitted = true;
    const payload = {
      sender: {
        name: this.chatservice.getFullName(this.currentUser),
        id: this.currentUser._id,
      },
      content: this.feedBackForm.value.content,
      type: this.feedBackForm.value.SelectIssue,
      files: this.selectedFile,
    };
    const formData = new FormData();
    formData.append('files', this.selectedFile);
    formData.append('data', JSON.stringify(payload));
    if (this.feedBackForm.valid) {
      this.chatservice.sendFeedBack(formData).subscribe();
    }
  }
}
