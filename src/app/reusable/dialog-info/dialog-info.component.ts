import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss'],
})
export class DialogInfoComponent {
  dialogId = 'infoDialog';
  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  ngOnInit() {
    this.dialogRef.updatePosition({
      bottom: '25px',
      right: '25px',
    });
    this.dialogRef.disableClose = true;
    if (this.data.title !== 'Credentials') {
      setTimeout(() => {
        this.dialogRef.close();
      }, 5000);
    }
  }
}
