import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ItemService} from '../../_services/item.service';

@Component({
  selector: 'delete-pc',
  templateUrl: 'delete-item.component.html',
})
export class DeleteItemComponent {
  constructor(
    public itemService: ItemService,
    public dialogRef: MatDialogRef<DeleteItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;
  nameCheck: boolean;

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  checkName() {
    this.nameCheck = (this.name === this.data.name);
  }

  confirmDelete() {
    this.itemService.deleteItem(this.name)
      .then(pr => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.dialogRef.close(false);
      });
  }
}
