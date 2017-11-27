import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { ItemService } from '../../_services/item.service';
import {Item} from '../../_types/Item';

@Component({
  selector: 'new-item',
  templateUrl: 'new-item.component.html',
})
export class NewItemComponent {
  constructor(
    private itemService: ItemService,
    public dialogRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  name: string;

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  createItem() {
    const item = new Item({
      'name': this.name
    });
    this.itemService.createItem(item)
      .then(pr => {
        this.dialogRef.close(item.name);
      })
      .catch(err => {
        this.dialogRef.close(false);
      });
  }
}
