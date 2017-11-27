// Angular assets
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Authored assets
import { Item } from '../_types/Item';
import { ItemService } from '../_services/item.service';
import { NewItemComponent } from './new-item/new-item.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  currentItem: Item;
  myItems: any;

  onSelect(item: Item): void {
    if (this.currentItem !== item) {
      this.currentItem = item;
    } else {
      this.currentItem = null;
    }
  }
  ngOnInit(): void {
    if (!this.myItems) {
      this.getItems();
    }
  }
  getItems(): void {
    this.myItems = this.itemService.getItemObservableList();
  }
  gotoDetail(): void {
    this.router.navigate(['/myItems', this.currentItem.name]);
  }
  createItem(): void {
    // Open dialog for name
    const dRef = this.dialog.open(NewItemComponent, { width: '37rem'});
    // navigate to new item sheet
    dRef.afterClosed().subscribe(name => {
      if (name && name !== '') {
        this.router.navigate(['/myItems', name]);
      }
    });
  }
  deleteItem(): void {
    // Open dialog for confirmation
    const dRef = this.dialog.open(DeleteItemComponent, { width: '37rem', data: { name: this.currentItem.name }});
    dRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.currentItem = null;
      }
    });
  }
}
