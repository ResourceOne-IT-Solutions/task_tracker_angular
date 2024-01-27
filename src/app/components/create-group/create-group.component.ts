import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent {
  'createGroupForm': FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
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
    if (this.createGroupForm.valid) {
      this.dialogRef.close(this.createGroupForm.value);
    }
  }
}
