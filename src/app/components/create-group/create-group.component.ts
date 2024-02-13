import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent {
  'createGroupForm': FormGroup;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public chartservice: ChatService,
  ) {
    this.createGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      userlist: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  CreateGroup() {
    this.submitted = true;
    if (this.createGroupForm.valid) {
      this.dialogRef.close(this.createGroupForm.value);
    }
  }
}
