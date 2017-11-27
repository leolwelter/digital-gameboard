// Angular Core
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';

// Authored
import {ItemService} from '../_services/item.service';
import {Item} from '../_types/Item';

// AngularFire2
import {AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
  ) {}
  item: Item;
  itemRef: AngularFireObject<Item>;
  itemData: Observable<Item>;
  rarities: string[] = ['common', 'uncommon', 'rare', 'very rare', 'legendary'];
  f_load = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.itemRef = this.itemService.getItemRef(name);
      this.itemData = this.itemRef.valueChanges();
      this.itemData.subscribe(item => {
        this.initItem(item);
        this.f_load = true;
      });
    });
  }


  initItem(itemData: Item): void {
    this.item = new Item(itemData);
  }

  saveItem(): void {
    this.itemRef.update(this.item)
      .then(success => {
        this.snackbar.open('Success!', '', {duration: 2000});
      })
      .catch(fail => {
        this.snackbar.open('Something went wrong', '', {duration: 2000});
      });
  }

  goBack(): void {
    this.location.back();
  }
}
